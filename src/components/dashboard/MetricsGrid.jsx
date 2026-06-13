import MetricCard from "./MetricCard";
import { useFinancialStore } from "../../store/useFinancialStore";
import { FiDollarSign, FiArrowUpRight, FiArrowDownRight, FiClock } from "react-icons/fi";

const MetricsGrid = () => {
  const { transactions, startingBalance, currency } = useFinancialStore();

  // Helper to format currency
  const formatVal = (val) => {
    return `${currency}${Math.abs(val).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  };

  // 1. Total Savings Calculation (Starting Balance + All completed Income - All completed Expense)
  const completedIncomeAll = transactions
    .filter((t) => t.type === "income" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const completedExpenseAll = transactions
    .filter((t) => t.type === "expense" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSavings = startingBalance + completedIncomeAll - completedExpenseAll;

  // Compute savings end of May to find percentage change
  const mayIncomeAll = transactions
    .filter((t) => t.date < "2026-06-01" && t.type === "income" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const mayExpenseAll = transactions
    .filter((t) => t.date < "2026-06-01" && t.type === "expense" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSavingsMay = startingBalance + mayIncomeAll - mayExpenseAll;
  const savingsChange = totalSavingsMay > 0
    ? ((totalSavings - totalSavingsMay) / totalSavingsMay) * 100
    : 0;

  // 2. Monthly Income (June 2026)
  const juneIncome = transactions
    .filter((t) => t.type === "income" && t.date.startsWith("2026-06"))
    .reduce((sum, t) => sum + t.amount, 0);

  const mayIncome = transactions
    .filter((t) => t.type === "income" && t.date.startsWith("2026-05"))
    .reduce((sum, t) => sum + t.amount, 0);

  const incomeChange = mayIncome > 0
    ? ((juneIncome - mayIncome) / mayIncome) * 100
    : 0;

  // 3. Monthly Expenses (June 2026)
  const juneExpense = transactions
    .filter((t) => t.type === "expense" && t.date.startsWith("2026-06"))
    .reduce((sum, t) => sum + t.amount, 0);

  const mayExpense = transactions
    .filter((t) => t.type === "expense" && t.date.startsWith("2026-05"))
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseChange = mayExpense > 0
    ? ((juneExpense - mayExpense) / mayExpense) * 100
    : 0;

  // 4. Runway calculation
  // Net Burn = June Expenses - June Income
  const netBurn = juneExpense - juneIncome;
  let runwayText = "Stable";
  let runwayChange = "0.0 Months";
  let runwayPositive = true;

  if (netBurn > 0) {
    const runwayMonths = totalSavings / netBurn;
    runwayText = `${runwayMonths.toFixed(1)} Months`;

    // Calculate runway change compared to May
    const mayNetBurn = mayExpense - mayIncome;
    if (mayNetBurn > 0) {
      const mayRunwayMonths = totalSavingsMay / mayNetBurn;
      const runwayDiff = runwayMonths - mayRunwayMonths;
      runwayChange = `${runwayDiff >= 0 ? "+" : ""}${runwayDiff.toFixed(1)} Months`;
      runwayPositive = runwayDiff >= 0;
    } else {
      runwayChange = "- Runway Established";
      runwayPositive = false;
    }
  } else {
    runwayText = "Stable (No Burn)";
    runwayChange = "Surplus";
    runwayPositive = true;
  }

  return (
    <div className="px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Savings"
        value={formatVal(totalSavings)}
        change={`${savingsChange >= 0 ? "+" : ""}${savingsChange.toFixed(1)}%`}
        positive={savingsChange >= 0}
        icon={FiDollarSign}
      />

      <MetricCard
        title="Monthly Income"
        value={formatVal(juneIncome)}
        change={`${incomeChange >= 0 ? "+" : ""}${incomeChange.toFixed(1)}%`}
        positive={incomeChange >= 0}
        icon={FiArrowUpRight}
      />

      <MetricCard
        title="Monthly Expenses"
        value={formatVal(juneExpense)}
        change={`${expenseChange >= 0 ? "+" : ""}${expenseChange.toFixed(1)}%`}
        positive={expenseChange <= 0} // expense going down is positive
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

export default MetricsGrid;
