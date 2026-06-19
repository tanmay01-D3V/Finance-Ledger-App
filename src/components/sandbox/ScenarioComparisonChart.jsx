// Import Recharts components for grouped bar chart
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip
} from "recharts";

// Import projection hook for baseline and stressed data
import { useProjection } from "../../hooks/useProjection";
// Import Zustand store for export function
import { useLedgerStore } from "../../store/useLedgerStore";
// Import encrypted export utility
import { downloadEncryptedExport } from "../../utils/encryptExport";
// Import reusable result card component
import ProjectionResultCard from "./ProjectionResultCard";

// Component showing a grouped bar chart comparing baseline vs stressed capital over 24 months
const ScenarioComparisonChart = () => {
  // Destructure projection data: both scenarios, drawdown metrics, and formatter
  const { baseline, stressed, maxDrawdown, interestLoss, formatCurrency } = useProjection({
    projectionMonths: 24
  });
  // Get exportLedger function from store for encrypted data export
  const exportLedger = useLedgerStore((s) => s.exportLedger);

  // Filter to forecast-only months and take first 12 for the chart
  const forecastBaseline = baseline.months.filter((m) => !m.isActual).slice(0, 12);
  const forecastStressed = stressed.months.filter((m) => !m.isActual).slice(0, 12);

  // Build chart data: each entry has month label, current balance, stressed balance (in thousands)
  const data = forecastBaseline.map((m, i) => ({
    month: m.monthLabel.split(" ")[0],
    current: Math.round(m.balance / 1000),
    stressed: Math.round((forecastStressed[i]?.balance ?? 0) / 1000)
  }));

  // Export handler: prompts for passphrase, then downloads encrypted ledger
  const handleExport = () => {
    const passphrase = window.prompt("Enter a passphrase to encrypt your export:");
    if (!passphrase) return;
    downloadEncryptedExport(exportLedger(), passphrase);
  };

  // Render chart card with header, bar chart, and summary metrics
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-8">
      {/* Header with title and legend */}
      <div className="flex justify-between mb-8">
        <div>
          <h2 className="text-4xl font-bold">Scenario Comparison</h2>
          <p className="text-gray-500 text-lg">Projected Liquid Capital Over 24 Months</p>
        </div>

        {/* Color legend */}
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

      {/* Grouped bar chart comparing current vs stressed plan */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <Tooltip formatter={(val) => [`$${Number(val).toLocaleString()}k`, ""]} />
          <Bar dataKey="current" fill="#e5e7eb" />
          <Bar dataKey="stressed" fill="#000" />
        </BarChart>
      </ResponsiveContainer>

      {/* Footer: summary metrics and action buttons */}
      <div className="border-t mt-8 pt-8 flex justify-between items-center">
        {/* Drawdown and interest loss cards */}
        <div className="flex gap-12">
          <ProjectionResultCard label="MAX DRAWDOWN" value={formatCurrency(maxDrawdown)} danger />
          <ProjectionResultCard label="INTEREST LOSS" value={formatCurrency(Math.abs(interestLoss))} />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          {/* Scroll-to-top button */}
          <button
            className="w-14 h-14 border rounded-xl"
            title="View projection details"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            🔍
          </button>

          {/* Export encrypted ledger button */}
          <button
            className="w-14 h-14 border rounded-xl"
            title="Export encrypted ledger"
            onClick={handleExport}
          >
            ⬇
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScenarioComparisonChart;
