import { useFinancialStore } from "../../store/useFinancialStore";
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

const IncomeExpenseChart = () => {
  const { transactions, currency } = useFinancialStore();

  // 1. Group transaction actuals by month (2026-01 to 2026-06)
  const months = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"];
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const chartData = months.map((m, index) => {
    const monthTx = transactions.filter((t) => t.date.startsWith(m) && t.status === "completed");
    const income = monthTx.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const expense = monthTx.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    return {
      name: monthLabels[index],
      income,
      expense
    };
  });

  // Custom tooltips
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-md p-4 border border-gray-100 rounded-2xl shadow-xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {data.name} 2026
          </p>
          <div className="flex justify-between items-center gap-6">
            <span className="text-xs text-gray-500 font-medium">Income:</span>
            <span className="font-bold text-emerald-600">
              {currency}
              {data.income.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center gap-6">
            <span className="text-xs text-gray-500 font-medium">Expense:</span>
            <span className="font-bold text-rose-600">
              {currency}
              {data.expense.toLocaleString()}
            </span>
          </div>
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
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-[400px]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Income vs Expense
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Comparing monthly incoming vs outgoing cashflow.
          </p>
        </div>
      </div>

      <div className="flex-1 w-full h-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              dy={10}
            />
            
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(val) => `${currency}${Math.round(val / 1000)}k`}
              dx={-10}
            />

            <Tooltip content={<CustomTooltip />} />
            
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11, paddingBottom: 15 }}
            />

            <Bar
              dataKey="income"
              name="Income"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            
            <Bar
              dataKey="expense"
              name="Expense"
              fill="#f43f5e"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeExpenseChart;