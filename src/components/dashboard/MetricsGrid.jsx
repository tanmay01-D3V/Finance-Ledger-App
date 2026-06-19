// Import MetricCard component for rendering individual KPI cards
import MetricCard from "./MetricCard";
// Import Zustand store for accessing transactions and starting balance
import { useLedgerStore } from "../../store/useLedgerStore";
// Import custom hook for projection computations (runway, formatting)
import { useProjection } from "../../hooks/useProjection";
// Import utility to compute current balance from transactions
import { computeCurrentBalance } from "../../utils/projectCashflow";
// Import icons for each metric card
import { FiDollarSign, FiArrowUpRight, FiArrowDownRight, FiClock } from "react-icons/fi";

// Top-level dashboard component displaying financial KPI metrics
const MetricsGrid = () => {
  // Extract transactions list and starting balance from global store
  const { transactions, startingBalance } = useLedgerStore();
  // Retrieve baseline runway info and currency formatter from projection hook
  const { baselineRunway, formatCurrency } = useProjection({ projectionMonths: 12 });

  // Compute total current savings by applying all transactions to starting balance
  const totalSavings = computeCurrentBalance(startingBalance, transactions);

  // Determine the latest month with transaction data, default to June 2026
  const latestMonth =
    transactions.map((t) => t.date.slice(0, 7)).sort().pop() || "2026-06";
  // Derive the previous month for period-over-period comparison
  const prevMonth = subtractMonth(latestMonth);

  // Helper: sum all completed income amounts for a given month key (YYYY-MM)
  const monthIncome = (monthKey) =>
    transactions
      .filter((t) => t.date.startsWith(monthKey) && t.type === "income" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

  // Helper: sum all completed expense amounts for a given month key (YYYY-MM)
  const monthExpense = (monthKey) =>
    transactions
      .filter((t) => t.date.startsWith(monthKey) && t.type === "expense" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

  // Capture income and expenses for both latest and previous month
  const juneIncome = monthIncome(latestMonth);
  const mayIncome = monthIncome(prevMonth);
  const juneExpense = monthExpense(latestMonth);
  const mayExpense = monthExpense(prevMonth);

  // Compute what savings were at the end of the previous month
  const savingsPrevMonth = computeCurrentBalance(
    startingBalance,
    transactions.filter((t) => t.date < `${latestMonth}-01`)
  );

  // Calculate percentage changes for savings, income, and expenses month-over-month
  const savingsChange =
    savingsPrevMonth > 0 ? ((totalSavings - savingsPrevMonth) / savingsPrevMonth) * 100 : 0;
  const incomeChange = mayIncome > 0 ? ((juneIncome - mayIncome) / mayIncome) * 100 : 0;
  const expenseChange = mayExpense > 0 ? ((juneExpense - mayExpense) / mayExpense) * 100 : 0;

  // Initialize runway display variables from baseline projection
  const netBurn = juneExpense - juneIncome;
  let runwayText = baselineRunway.label;
  let runwayChange = "0.0 Months";
  let runwayPositive = true;

  // Determine runway text and trend based on funding status and net burn
  if (baselineRunway.isFullyFunded) {
    // No risk of running out — income exceeds or equals expenses
    runwayText = "Stable (No Burn)";
    runwayChange = "Surplus";
  } else if (Number.isFinite(baselineRunway.runwayMonths)) {
    // Finite runway calculated — show months remaining with trend vs prior month
    runwayText = `${baselineRunway.runwayMonths.toFixed(1)} Months`;
    const mayNetBurn = mayExpense - mayIncome;
    if (mayNetBurn > 0 && savingsPrevMonth > 0) {
      // Compute prior month's runway for comparison
      const mayRunway = savingsPrevMonth / mayNetBurn;
      const diff = baselineRunway.runwayMonths - mayRunway;
      runwayChange = `${diff >= 0 ? "+" : ""}${diff.toFixed(1)} Months`;
      runwayPositive = diff >= 0;
    }
  } else if (netBurn > 0) {
    // Fallback: simple runway estimate from current savings / net burn
    runwayText = `${(totalSavings / netBurn).toFixed(1)} Months`;
  }

  // Render the four metric cards in a responsive grid layout
  return (
    <div className="px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Card 1: Total Savings with percentage change */}
      <MetricCard
        title="Total Savings"
        value={formatCurrency(totalSavings)}
        change={`${savingsChange >= 0 ? "+" : ""}${savingsChange.toFixed(1)}%`}
        positive={savingsChange >= 0}
        icon={FiDollarSign}
      />

      {/* Card 2: Monthly Income with percentage change */}
      <MetricCard
        title="Monthly Income"
        value={formatCurrency(juneIncome)}
        change={`${incomeChange >= 0 ? "+" : ""}${incomeChange.toFixed(1)}%`}
        positive={incomeChange >= 0}
        icon={FiArrowUpRight}
      />

      {/* Card 3: Monthly Expenses — positive trend means decrease */}
      <MetricCard
        title="Monthly Expenses"
        value={formatCurrency(juneExpense)}
        change={`${expenseChange >= 0 ? "+" : ""}${expenseChange.toFixed(1)}%`}
        positive={expenseChange <= 0}
        icon={FiArrowDownRight}
      />

      {/* Card 4: Financial Runway — months of expenses covered */}
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

// Helper function to compute the previous month from a YYYY-MM string
function subtractMonth(yyyyMm) {
  // Parse year and month from input string
  const [y, m] = yyyyMm.split("-").map(Number);
  // Create a date object for the first of the previous month
  const date = new Date(y, m - 2, 1);
  // Return formatted as YYYY-MM with zero-padded month
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export default MetricsGrid;
