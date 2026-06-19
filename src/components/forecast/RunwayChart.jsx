// Import React state hook for horizon selector
import { useState } from "react";
// Import projection hook for long-term cashflow data
import { useProjection } from "../../hooks/useProjection";
// Import Recharts components for line chart
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// Component showing multi-year cashflow projection as a line chart
const RunwayChart = () => {
  // State: selected projection horizon (3, 5, or 10 years), default 3
  const [horizonYears, setHorizonYears] = useState(3);
  // Fetch long-horizon projection data based on selected years
  const { longHorizon, currency } = useProjection({
    historicalMonths: 0,
    projectionMonths: horizonYears * 12,
    horizonYears
  });

  // Build yearly data points from forecast months
  const yearlyData = [];
  // Only use forecasted (non-actual) months for projection display
  const forecastMonths = longHorizon.months.filter((m) => !m.isActual);

  // Sample one data point per year at the 12-month mark
  for (let y = 0; y < horizonYears; y++) {
    const monthIdx = Math.min((y + 1) * 12 - 1, forecastMonths.length - 1);
    if (monthIdx >= 0) {
      yearlyData.push({
        year: String(new Date().getFullYear() + y),
        cash: Math.max(0, forecastMonths[monthIdx]?.balance ?? 0)
      });
    }
  }

  // Fallback: if no forecast data, show current balance as single point
  if (yearlyData.length === 0 && longHorizon.months.length > 0) {
    yearlyData.push({
      year: String(new Date().getFullYear()),
      cash: longHorizon.summary.currentBalance
    });
  }

  // Render chart card with horizon selector buttons
  return (
    <div className="bg-white border rounded-3xl p-8">
      {/* Header with title and year selector */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Multi-year Cashflow Projection</h2>
          <p className="text-gray-500">Scenario: Baseline Operations</p>
        </div>

        {/* Horizon toggle: 3, 5, or 10 years */}
        <div className="flex gap-2">
          {[3, 5, 10].map((years) => (
            <button
              key={years}
              onClick={() => setHorizonYears(years)}
              className={`px-4 py-2 rounded-lg ${
                horizonYears === years ? "bg-gray-100" : ""
              }`}
            >
              {years} Years
            </button>
          ))}
        </div>
      </div>

      {/* Line chart with responsive sizing */}
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={yearlyData}>
          {/* X-axis: year labels */}
          <XAxis dataKey="year" />
          {/* Y-axis: currency amounts abbreviated to k */}
          <YAxis tickFormatter={(v) => `${currency}${Math.round(v / 1000)}k`} />
          {/* Tooltip showing formatted currency */}
          <Tooltip
            formatter={(val) => [`${currency}${Number(val).toLocaleString()}`, "Cash"]}
          />
          {/* Single black line for cash balance */}
          <Line
            type="monotone"
            dataKey="cash"
            stroke="#111827"
            strokeWidth={4}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RunwayChart;
