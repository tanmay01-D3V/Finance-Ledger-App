/**
 * Standard amortizing loan schedule (fixed monthly payment).
 * @param {Object} params
 * @param {number} params.principal - Loan principal
 * @param {number} params.annualRate - Annual interest rate as percentage (e.g. 5.5 for 5.5%)
 * @param {number} params.termMonths - Total loan term in months
 * @param {string} [params.startMonth] - YYYY-MM when payments begin
 * @returns {{ monthlyPayment: number, schedule: Array, totalInterest: number }}
 */
export function amortize({ principal, annualRate, termMonths, startMonth = null }) {
  const p = Number(principal);
  const n = Number(termMonths);
  const monthlyRate = Number(annualRate) / 100 / 12;

  if (p <= 0 || n <= 0) {
    return { monthlyPayment: 0, schedule: [], totalInterest: 0 };
  }

  let monthlyPayment;
  if (monthlyRate === 0) {
    monthlyPayment = p / n;
  } else {
    monthlyPayment =
      (p * monthlyRate * Math.pow(1 + monthlyRate, n)) /
      (Math.pow(1 + monthlyRate, n) - 1);
  }
 
  let balance = p;
  let totalInterest = 0;
  const schedule = [];

  for (let i = 0; i < n; i++) {
    const interest = balance * monthlyRate;
    const principalPaid = monthlyPayment - interest;
    balance = Math.max(0, balance - principalPaid);
    totalInterest += interest;

    schedule.push({
      monthIndex: i + 1,
      monthKey: startMonth ? addMonths(startMonth, i) : null,
      payment: round2(monthlyPayment),
      interest: round2(interest),
      principal: round2(principalPaid),
      balance: round2(balance)
    });
  }

  return {
    monthlyPayment: round2(monthlyPayment),
    schedule,
    totalInterest: round2(totalInterest)
  };
}

/**
 * Returns loan payment breakdown for a specific month key.
 */
export function getLoanPaymentForMonth(loans, monthKey) {
  let interest = 0;
  let principal = 0;

  for (const loan of loans || []) {
    const { schedule } = amortize(loan);
    const entry = schedule.find((s) => s.monthKey === monthKey);
    if (entry) {
      interest += entry.interest;
      principal += entry.principal;
    }
  }

  return { interest, principal, total: interest + principal };
}

function addMonths(yyyyMm, offset) {
  const [y, m] = yyyyMm.split("-").map(Number);
  const date = new Date(y, m - 1 + offset, 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

export default amortize;
