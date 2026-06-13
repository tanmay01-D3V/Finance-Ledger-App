import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";

import ProjectionResultCard from "./ProjectionResultCard";

const data = [
  { month: "Jan", current: 90, stressed: 70 },
  { month: "Feb", current: 92, stressed: 70 },
  { month: "Mar", current: 95, stressed: 66 },
  { month: "Apr", current: 97, stressed: 63 },
  { month: "May", current: 100, stressed: 59 },
  { month: "Jun", current: 103, stressed: 55 },
  { month: "Jul", current: 106, stressed: 52 },
  { month: "Aug", current: 104, stressed: 45 },
  { month: "Sep", current: 107, stressed: 42 },
  { month: "Oct", current: 110, stressed: 37 },
  { month: "Nov", current: 111, stressed: 28 },
  { month: "Dec", current: 112, stressed: 20 },
];

const ScenarioComparisonChart = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-8">

      <div className="flex justify-between mb-8">

        <div>
          <h2 className="text-4xl font-bold">
            Scenario Comparison
          </h2>

          <p className="text-gray-500 text-lg">
            Projected Liquid Capital Over 24 Months
          </p>
        </div>

        <div className="flex gap-6 text-sm font-medium">

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-300" />
            Current Plan
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-black" />
            Stressed Plan
          </div>

        </div>

      </div>

      <ResponsiveContainer
        width="100%"
        height={400}
      >
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <Tooltip />

          <Bar
            dataKey="current"
            fill="#e5e7eb"
          />

          <Bar
            dataKey="stressed"
            fill="#000"
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="border-t mt-8 pt-8 flex justify-between items-center">

        <div className="flex gap-12">

          <ProjectionResultCard
            label="MAX DRAWDOWN"
            value="$62,400"
            danger
          />

          <ProjectionResultCard
            label="INTEREST LOSS"
            value="$1,240"
          />

        </div>

        <div className="flex gap-3">

          <button className="w-14 h-14 border rounded-xl">
            🔍
          </button>

          <button className="w-14 h-14 border rounded-xl">
            ⬇
          </button>

        </div>

      </div>

    </div>
  );
};

export default ScenarioComparisonChart;