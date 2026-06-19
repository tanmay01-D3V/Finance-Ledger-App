// Import projection hook for baseline cashflow data
import { useProjection } from "../../hooks/useProjection";
// Import Recharts components for rendering area chart
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

// Custom tooltip for the cashflow forecast chart showing actual vs forecast values
function CashflowTooltip({ active, payload, currency, projectedMonthlyNet }) {
  // Render only when tooltip is active and data is available
  if (active && payload && payload.length) {
    // Extract the hovered data point
    const data = payload[0].payload;
    // Determine whether this point is actual or forecast
    const isActual = data.type === "actual";
    // Pick the value from the appropriate series
    const value = isActual ? data.actual : data.forecast;
    return (
      // Styled tooltip card
      <div className="bg-white/95 backdrop-blur-md p-4 border border-gray-100 rounded-2xl shadow-xl">
        {/* Month label with type indicator */}
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {data.name} ({isActual ? "Actual" : "Forecasted"})
        </p>
        {/* Formatted value display */}
        <p className="text-xl font-bold text-gray-900 mt-1">
          {currency}
          {Math.round(value).toLocaleString()}
        </p>
        {/* For forecast points, show the underlying monthly net projection */}
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
}

// Dashboard component showing a 12-month cashflow trajectory with actual and forecast areas
const CashflowForecastChart = () => {
  // Pull baseline projection data (6 historical + 12 projected months)
  const { baseline, currency } = useProjection({ historicalMonths: 6, projectionMonths: 12 });

  // Map projection months into chart-compatible format with separate actual/forecast series
  const chartData = baseline.months.map((m) => ({
    name: m.monthLabel,
    actual: m.isActual ? m.balance : null,
    forecast: !m.isActual ? m.balance : null,
    type: m.isActual ? "actual" : "forecast"
  }));

  // Bridge the gap: set the last actual point's forecast to same value so lines connect
  if (chartData.length > 0) {
    let lastActualIdx = -1;
    for (let i = chartData.length - 1; i >= 0; i--) {
      if (chartData[i].type === "actual") {
        lastActualIdx = i;
        break;
      }
    }
    if (lastActualIdx >= 0 && lastActualIdx + 1 < chartData.length) {
      chartData[lastActualIdx].forecast = chartData[lastActualIdx].actual;
    }
  }

  // Extract the projected monthly net for the tooltip display
  const projectedMonthlyNet = baseline.summary.avgNet;

  // Render the chart card
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-[400px]">
      {/* Header with title and legend */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Cashflow Forecast</h3>
          <p className="text-xs text-gray-500 mt-1">
            12-month runway trajectory based on average net burn.
          </p>
        </div>
        {/* Color-coded legend indicators */}
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

      {/* Chart area */}
      <div className="flex-1 w-full h-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            {/* Gradient fills for both series */}
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

            {/* Horizontal grid lines */}
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

            {/* X-axis: month labels */}
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              dy={10}
            />

            {/* Y-axis: abbreviated currency amounts */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(val) => `${currency}${Math.round(val / 1000)}k`}
              dx={-10}
            />

            {/* Custom tooltip with monthly net context */}
            <Tooltip
              content={
                <CashflowTooltip
                  currency={currency}
                  projectedMonthlyNet={projectedMonthlyNet}
                />
              }
            />

            {/* Actual data area — solid indigo line */}
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#4f46e5"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorActual)"
              connectNulls
            />

            {/* Forecast data area — dashed violet line */}
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
