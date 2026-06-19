// Import Zustand store for transaction data and currency setting
import { useLedgerStore } from "../../store/useLedgerStore";
// Import Recharts components for rendering bar chart
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

// Custom tooltip component rendered on hover over a bar
function IncomeExpenseTooltip({ active, payload, currency }) {
  // Only render when tooltip is active and payload data exists
  if (active && payload && payload.length) {
    // Extract the data point from the first payload entry
    const data = payload[0].payload;
    return (
      // Styled container with backdrop blur and shadow
      <div className="bg-white/95 backdrop-blur-md p-4 border border-gray-100 rounded-2xl shadow-xl space-y-2">
        {/* Month label header */}
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{data.name}</p>
        {/* Income row */}
        <div className="flex justify-between items-center gap-6">
          <span className="text-xs text-gray-500 font-medium">Income:</span>
          <span className="font-bold text-emerald-600">
            {currency}
            {data.income.toLocaleString()}
          </span>
        </div>
        {/* Expense row */}
        <div className="flex justify-between items-center gap-6">
          <span className="text-xs text-gray-500 font-medium">Expense:</span>
          <span className="font-bold text-rose-600">
            {currency}
            {data.expense.toLocaleString()}
          </span>
        </div>
        {/* Net cashflow row with conditional coloring */}
        <div className="border-t border-gray-50 pt-2 flex justify-between items-center gap-6">
          <span className="text-xs text-gray-500 font-semibold">Net Cashflow:</span>
          <span
            className={`font-bold ${
              data.income - data.expense >= 0 ? "text-indigo-600" : "text-amber-600"
            }`}
          >
            {data.income - data.expense >= 0 ? "+" : "-"}
            {currency}
            {Math.abs(data.income - data.expense).toLocaleString()}
          </span>
        </div>
      </div>
    );
  }
  // Return nothing when tooltip is inactive
  return null;
}

// Dashboard component showing a grouped bar chart of income vs expense over recent months
const IncomeExpenseChart = () => {
  // Pull transactions and currency symbol from global store
  const { transactions, currency } = useLedgerStore();

  // Extract unique month keys from transactions, sorted, take last 6
  const monthKeys = [...new Set(transactions.map((t) => t.date.slice(0, 7)))]
    .sort()
    .slice(-6);

  // Transform month keys into chart data entries with income and expense totals
  const chartData = monthKeys.map((m) => {
    // Filter completed transactions for this month
    const monthTx = transactions.filter((t) => t.date.startsWith(m) && t.status === "completed");
    // Sum income amounts
    const income = monthTx.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    // Sum expense amounts
    const expense = monthTx.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    // Convert numeric month to short label
    const [, month] = m.split("-");
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return { name: labels[Number(month) - 1], income, expense };
  });

  // Render the chart card with responsive container
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-[400px]">
      {/* Header section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Income vs Expense</h3>
          <p className="text-xs text-gray-500 mt-1">
            Comparing monthly incoming vs outgoing cashflow.
          </p>
        </div>
      </div>

      {/* Chart area — fills remaining height */}
      <div className="flex-1 w-full h-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }} barGap={8}>
            {/* Light grid lines, only horizontal */}
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

            {/* X-axis: month labels */}
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              dy={10}
            />

            {/* Y-axis: currency amounts abbreviated to k */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(val) => `${currency}${Math.round(val / 1000)}k`}
              dx={-10}
            />

            {/* Custom tooltip component */}
            <Tooltip content={<IncomeExpenseTooltip currency={currency} />} />

            {/* Legend positioned top-right */}
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11, paddingBottom: 15 }}
            />

            {/* Green bars for income */}
            <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
            {/* Red bars for expense */}
            <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeExpenseChart;
