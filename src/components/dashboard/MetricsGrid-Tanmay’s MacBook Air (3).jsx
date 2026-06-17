import MetricCard from "./MetricCard";
import { useLedgerStore } from "../../store/useLedgerStore";
import { useProjection } from "../../hooks/useProjection";
import { computeCurrentBalance } from "../../utils/projectCashflow";
import { FiDollarSign, FiArrowUpRight, FiArrowDownRight, FiClock } from "react-icons/fi";

const MetricsGrid = () => {
  const { transactions, startingBalance } = useLedgerStore();
  const { baselineRunway, formatCurrency } = useProjection({ projectionMonths: 12 });

  const totalSavings = computeCurrentBalance(startingBalance, transactions);

  const latestMonth =
    transactions.map((t) => t.date.slice(0, 7)).sort().pop() || "2026-06";
  const prevMonth = subtractMonth(latestMonth);

  const monthIncome = (monthKey) =>
    transactions
      .filter((t) => t.date.startsWith(monthKey) && t.type === "income" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

  const monthExpense = (monthKey) =>
    transactions
      .filter((t) => t.date.startsWith(monthKey) && t.type === "expense" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

  const juneIncome = monthIncome(latestMonth);
  const mayIncome = monthIncome(prevMonth);
  const juneExpense = monthExpense(latestMonth);
  const mayExpense = monthExpense(prevMonth);

  const savingsPrevMonth = computeCurrentBalance(
    startingBalance,
    transactions.filter((t) => t.date < `${latestMonth}-01`)
  );

  const savingsChange =
    savingsPrevMonth > 0 ? ((totalSavings - savingsPrevMonth) / savingsPrevMonth) * 100 : 0;
  const incomeChange = mayIncome > 0 ? ((juneIncome - mayIncome) / mayIncome) * 100 : 0;
  const expenseChange = mayExpense > 0 ? ((juneExpense - mayExpense) / mayExpense) * 100 : 0;

  const netBurn = juneExpense - juneIncome;
  let runwayText = baselineRunway.label;
  let runwayChange = "0.0 Months";
  let runwayPositive = true;

  if (baselineRunway.isFullyFunded) {
    runwayText = "Stable (No Burn)";
    runwayChange = "Surplus";
  } else if (Number.isFinite(baselineRunway.runwayMonths)) {
    runwayText = `${baselineRunway.runwayMonths.toFixed(1)} Months`;
    const mayNetBurn = mayExpense - mayIncome;
    if (mayNetBurn > 0 && savingsPrevMonth > 0) {
      const mayRunway = savingsPrevMonth / mayNetBurn;
      const diff = baselineRunway.runwayMonths - mayRunway;
      runwayChange = `${diff >= 0 ? "+" : ""}${diff.toFixed(1)} Months`;
      runwayPositive = diff >= 0;
    }
  } else if (netBurn > 0) {
    runwayText = `${(totalSavings / netBurn).toFixed(1)} Months`;
  }

  return (
    <div className="px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Savings"
        value={formatCurrency(totalSavings)}
        change={`${savingsChange >= 0 ? "+" : ""}${savingsChange.toFixed(1)}%`}
        positive={savingsChange >= 0}
        icon={FiDollarSign}
      />

      <MetricCard
        title="Monthly Income"
        value={formatCurrency(juneIncome)}
        change={`${incomeChange >= 0 ? "+" : ""}${incomeChange.toFixed(1)}%`}
        positive={incomeChange >= 0}
        icon={FiArrowUpRight}
      />

      <MetricCard
        title="Monthly Expenses"
        value={formatCurrency(juneExpense)}
        change={`${expenseChange >= 0 ? "+" : ""}${expenseChange.toFixed(1)}%`}
        positive={expenseChange <= 0}
        icon={FiArrowDownRight}
      />

      <MetricCard
        title="Financial Runway"
        value={runwayText}
        change={runwayChange}
        positive={runwayPositive}
        icon={FiClock}
      />
    </div>
  );
};

function subtractMonth(yyyyMm) {
  const [y, m] = yyyyMm.split("-").map(Number);
  const date = new Date(y, m - 2, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export default MetricsGrid;
