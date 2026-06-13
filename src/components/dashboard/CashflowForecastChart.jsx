import { useFinancialStore } from "../../store/useFinancialStore";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const CashflowForecastChart = () => {
  const { transactions, startingBalance, currency } = useFinancialStore();

  // 1. Group transaction actuals by month (2026-01 to 2026-06)
  const months = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"];
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const actualsData = months.map((m) => {
    const monthTx = transactions.filter((t) => t.date.startsWith(m) && t.status === "completed");
    const income = monthTx.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const expense = monthTx.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    return { month: m, income, expense, net: income - expense };
  });

  // Calculate cumulative balance historically
  let currentCumulative = startingBalance;
  const historicalBalances = actualsData.map((d, index) => {
    currentCumulative += d.net;
    return {
      name: monthLabels[index],
      actual: currentCumulative,
      forecast: null,
      type: "actual"
    };
  });

  // 2. Project forecast (next 12 months: July 2026 to June 2027)
  // Compute average monthly income & expense from historical actuals
  const totalMonths = actualsData.length;
  const avgIncome = actualsData.reduce((sum, d) => sum + d.income, 0) / totalMonths;
  const avgExpense = actualsData.reduce((sum, d) => sum + d.expense, 0) / totalMonths;
  const projectedMonthlyNet = avgIncome - avgExpense;

  const forecastLabels = [
    "Jul 26", "Aug 26", "Sep 26", "Oct 26", "Nov 26", "Dec 26",
    "Jan 27", "Feb 27", "Mar 27", "Apr 27", "May 27", "Jun 27"
  ];

  // Junction point: The forecast series starts at the last actual value (June 2026) for seamless connection
  historicalBalances[historicalBalances.length - 1].forecast = currentCumulative;

  const forecastedBalances = forecastLabels.map((label, index) => {
    currentCumulative += projectedMonthlyNet;
    return {
      name: label,
      actual: null,
      forecast: currentCumulative,
      type: "forecast"
    };
  });

  const chartData = [...historicalBalances, ...forecastedBalances];

  // Custom tooltips
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isActual = data.type === "actual";
      const value = isActual ? data.actual : data.forecast;
      return (
        <div className="bg-white/95 backdrop-blur-md p-4 border border-gray-100 rounded-2xl shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {data.name} ({isActual ? "Actual" : "Forecasted"})
          </p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {currency}
            {Math.round(value).toLocaleString()}
          </p>
          {!isActual && (
            <p className="text-xs text-gray-500 mt-1">
              Based on monthly net change: {projectedMonthlyNet >= 0 ? "+" : ""}
              {currency}
              {Math.round(projectedMonthlyNet).toLocaleString()}/mo
            </p>
          )}
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
            Cashflow Forecast
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            12-month runway trajectory based on average net burn.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-indigo-600">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            Actual
          </span>
          <span className="flex items-center gap-1.5 text-violet-400">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-400 border border-dashed border-violet-600"></span>
            Forecast
          </span>
        </div>
      </div>

      <div className="flex-1 w-full h-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>

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

            {/* Actual series */}
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#4f46e5"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorActual)"
              connectNulls
            />

            {/* Forecast series */}
            <Area
              type="monotone"
              dataKey="forecast"
              stroke="#8b5cf6"
              strokeDasharray="5 5"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorForecast)"
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CashflowForecastChart;