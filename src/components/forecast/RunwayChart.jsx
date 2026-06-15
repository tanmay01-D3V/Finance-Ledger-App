import { useState } from "react";
import { useProjection } from "../../hooks/useProjection";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const RunwayChart = () => {
  const [horizonYears, setHorizonYears] = useState(3);
  const { longHorizon, currency } = useProjection({
    historicalMonths: 0,
    projectionMonths: horizonYears * 12,
    horizonYears
  });

  const yearlyData = [];
  const forecastMonths = longHorizon.months.filter((m) => !m.isActual);

  for (let y = 0; y < horizonYears; y++) {
    const monthIdx = Math.min((y + 1) * 12 - 1, forecastMonths.length - 1);
    if (monthIdx >= 0) {
      yearlyData.push({
        year: String(new Date().getFullYear() + y),
        cash: Math.max(0, forecastMonths[monthIdx]?.balance ?? 0)
      });
    }
  }

  if (yearlyData.length === 0 && longHorizon.months.length > 0) {
    yearlyData.push({
      year: String(new Date().getFullYear()),
      cash: longHorizon.summary.currentBalance
    });
  }

  return (
    <div className="bg-white border rounded-3xl p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Multi-year Cashflow Projection</h2>
          <p className="text-gray-500">Scenario: Baseline Operations</p>
        </div>

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

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={yearlyData}>
          <XAxis dataKey="year" />
          <YAxis tickFormatter={(v) => `${currency}${Math.round(v / 1000)}k`} />
          <Tooltip
            formatter={(val) => [`${currency}${Number(val).toLocaleString()}`, "Cash"]}
          />
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
