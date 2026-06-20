import { resolveFrequency } from "./resolveFrequency.js";
import { getLoanPaymentForMonth } from "./amortize.js";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Core month-by-month cashflow projection loop.
 *
 * @param {Object} params
 * @param {number} params.startingBalance
 * @param {Array} params.transactions
 * @param {number} [params.historicalMonths=6] - Past months to include as actuals
 * @param {number} [params.projectionMonths=12] - Future months to project
 * @param {string} [params.anchorMonth] - Last historical month (YYYY-MM)
 * @param {Object} [params.scenario] - Stress-test overrides
 * @param {Array} [params.loans] - Active loan definitions
 * @param {Array} [params.recurringItems] - Recurring income/expense with frequency
 * @returns {{ months: Array, summary: Object }}
 */
export function projectCashflow({
  startingBalance,
  transactions = [],
  historicalMonths = 6,
  projectionMonths = 12,
  anchorMonth = null,
  scenario = null,
  loans = [],
  recurringItems = []
}) {
  const completed = transactions.filter((t) => t.status === "completed");
  const anchor = anchorMonth || getLatestMonthKey(completed) || getCurrentMonthKey();

  const historicalKeys = buildMonthRange(subtractMonths(anchor, historicalMonths - 1), anchor);
  const forecastStart = addMonthsKey(anchor, 1);
  const forecastKeys = buildMonthRange(forecastStart, addMonthsKey(forecastStart, projectionMonths - 1));

  const monthlyActuals = groupTransactionsByMonth(completed);
  const { avgIncome, avgExpense, avgSalary } = computeAverages(monthlyActuals, completed);

  let balance = Number(startingBalance);
  const months = [];

  for (const monthKey of historicalKeys) {
    const actual = monthlyActuals[monthKey] || { income: 0, expense: 0 };
    const net = actual.income - actual.expense;
    balance += net;

    months.push({
      monthKey,
      monthLabel: formatMonthLabel(monthKey),
      income: actual.income,
      expense: actual.expense,
      net,
      balance: round2(balance),
      interestPaid: 0,
      isActual: true
    });
  }

  const lastBalance = balance;
  let cumulativeInterest = 0;
  let maxDrawdown = 0;
  let peakBalance = lastBalance;

  for (let i = 0; i < forecastKeys.length; i++) {
    const monthKey = forecastKeys[i];
    const monthIndex = i + 1;

    let income = avgIncome;
    let expense = avgExpense;

    if (scenario) {
      const inflationRate = Number(scenario.inflationRate) || 0;
      const inflationMultiplier = Math.pow(1 + inflationRate / 100, i / 12);
      expense *= inflationMultiplier;

      if (monthIndex === 1 && scenario.emergencyExpense) {
        expense += Number(scenario.emergencyExpense);
      }

      if (scenario.jobLoss && monthIndex >= (scenario.jobLossMonth || 3)) {
        income = Math.max(0, income - avgSalary);
      }

      if (scenario.burnReduction) {
        expense = Math.max(0, expense - Number(scenario.burnReduction));
      }
    }

    for (const item of recurringItems) {
      const monthly = resolveFrequency(item.amount, item.frequency || "monthly");
      if (item.type === "income") income += monthly;
      else expense += monthly;
    }

    const loanPayment = getLoanPaymentForMonth(
      (loans || []).map((loan) => ({
        ...loan,
        startMonth: loan.startMonth || forecastStart
      })),
      monthKey
    );
    expense += loanPayment.total;
    cumulativeInterest += loanPayment.interest;

    const net = income - expense;
    balance += net;

    if (balance > peakBalance) peakBalance = balance;
    const drawdown = peakBalance - balance;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;

    months.push({
      monthKey,
      monthLabel: formatMonthLabel(monthKey),
      income: round2(income),
      expense: round2(expense),
      net: round2(net),
      balance: round2(balance),
      interestPaid: round2(loanPayment.interest),
      isActual: false
    });
  }

  const forecastOnly = months.filter((m) => !m.isActual);
  const avgMonthlyIncome =
    forecastOnly.reduce((s, m) => s + m.income, 0) / Math.max(forecastOnly.length, 1);
  const avgMonthlyExpense =
    forecastOnly.reduce((s, m) => s + m.expense, 0) / Math.max(forecastOnly.length, 1);
  const avgNet = avgMonthlyIncome - avgMonthlyExpense;

  return {
    months,
    summary: {
      startingBalance: Number(startingBalance),
      currentBalance: round2(lastBalance),
      endingBalance: round2(balance),
      avgMonthlyIncome: round2(avgMonthlyIncome),
      avgMonthlyExpense: round2(avgMonthlyExpense),
      avgNet: round2(avgNet),
      avgBurnRate: round2(Math.max(0, -avgNet)),
      maxDrawdown: round2(maxDrawdown),
      totalInterestPaid: round2(cumulativeInterest),
      netSavingsRate: round2(avgNet)
    }
  };
}

/** Compute current balance from starting balance + all completed transactions. */
export function computeCurrentBalance(startingBalance, transactions = []) {
  return transactions
    .filter((t) => t.status === "completed")
    .reduce(
      (bal, t) => bal + (t.type === "income" ? t.amount : -t.amount),
      Number(startingBalance)
    );
}

function computeAverages(monthlyActuals, transactions) {
  const keys = Object.keys(monthlyActuals);
  if (keys.length === 0) {
    return { avgIncome: 0, avgExpense: 0, avgSalary: 0 };
  }

  let totalIncome = 0;
  let totalExpense = 0;

  for (const key of keys) {
    totalIncome += monthlyActuals[key].income;
    totalExpense += monthlyActuals[key].expense;
  }

  const avgIncome = totalIncome / keys.length;
  const avgExpense = totalExpense / keys.length;

  const salaryTx = transactions.filter(
    (t) => t.type === "income" && t.category === "Salary"
  );
  const salaryMonths = new Set(salaryTx.map((t) => t.date.slice(0, 7)));
  const avgSalary =
    salaryMonths.size > 0
      ? salaryTx.reduce((s, t) => s + t.amount, 0) / salaryMonths.size
      : avgIncome * 0.5;

  return { avgIncome, avgExpense, avgSalary };
}

function groupTransactionsByMonth(transactions) {
  return transactions.reduce((acc, tx) => {
    const key = tx.date.slice(0, 7);
    if (!acc[key]) acc[key] = { income: 0, expense: 0 };
    if (tx.type === "income") acc[key].income += tx.amount;
    else acc[key].expense += tx.amount;
    return acc;
  }, {});
}

function getLatestMonthKey(transactions) {
  if (transactions.length === 0) return null;
  return transactions
    .map((t) => t.date.slice(0, 7))
    .sort()
    .pop();
}

function getCurrentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function buildMonthRange(startKey, endKey) {
  const months = [];
  let current = startKey;
  while (current <= endKey) {
    months.push(current);
    current = addMonthsKey(current, 1);
  }
  return months;
}

function addMonthsKey(yyyyMm, offset) {
  const [y, m] = yyyyMm.split("-").map(Number);
  const date = new Date(y, m - 1 + offset, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function subtractMonths(yyyyMm, offset) {
  return addMonthsKey(yyyyMm, -offset);
}

function formatMonthLabel(yyyyMm) {
  const [y, m] = yyyyMm.split("-").map(Number);
  const shortYear = String(y).slice(-2);
  return `${MONTH_LABELS[m - 1]} ${shortYear}`;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

export default projectCashflow;
