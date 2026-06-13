import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { year: "2023", cash: 1250000 },
  { year: "2024", cash: 1200000 },
  { year: "2025", cash: 950000 },
  { year: "2026", cash: 500000 },
  { year: "2027", cash: 0 }
];

const RunwayChart = () => {
  return (
    <div className="bg-white border rounded-3xl p-8">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-3xl font-bold">
            Multi-year Cashflow Projection
          </h2>

          <p className="text-gray-500">
            Scenario: Baseline Operations
          </p>
        </div>

        <div className="flex gap-2">

          <button className="px-4 py-2 bg-gray-100 rounded-lg">
            3 Years
          </button>

          <button className="px-4 py-2 rounded-lg">
            5 Years
          </button>

          <button className="px-4 py-2 rounded-lg">
            10 Years
          </button>

        </div>

      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />

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