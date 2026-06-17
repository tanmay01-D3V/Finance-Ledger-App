import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip
} from "recharts";

import { useProjection } from "../../hooks/useProjection";
import { useLedgerStore } from "../../store/useLedgerStore";
import { downloadEncryptedExport } from "../../utils/encryptExport";
import ProjectionResultCard from "./ProjectionResultCard";

const ScenarioComparisonChart = () => {
  const { baseline, stressed, maxDrawdown, interestLoss, formatCurrency } = useProjection({
    projectionMonths: 24
  });
  const exportLedger = useLedgerStore((s) => s.exportLedger);

  const forecastBaseline = baseline.months.filter((m) => !m.isActual).slice(0, 12);
  const forecastStressed = stressed.months.filter((m) => !m.isActual).slice(0, 12);

  const data = forecastBaseline.map((m, i) => ({
    month: m.monthLabel.split(" ")[0],
    current: Math.round(m.balance / 1000),
    stressed: Math.round((forecastStressed[i]?.balance ?? 0) / 1000)
  }));

  const handleExport = () => {
    const passphrase = window.prompt("Enter a passphrase to encrypt your export:");
    if (!passphrase) return;
    downloadEncryptedExport(exportLedger(), passphrase);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-8">
      <div className="flex justify-between mb-8">
        <div>
          <h2 className="text-4xl font-bold">Scenario Comparison</h2>
          <p className="text-gray-500 text-lg">Projected Liquid Capital Over 24 Months</p>
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

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <Tooltip formatter={(val) => [`$${Number(val).toLocaleString()}k`, ""]} />
          <Bar dataKey="current" fill="#e5e7eb" />
          <Bar dataKey="stressed" fill="#000" />
        </BarChart>
      </ResponsiveContainer>

      <div className="border-t mt-8 pt-8 flex justify-between items-center">
        <div className="flex gap-12">
          <ProjectionResultCard label="MAX DRAWDOWN" value={formatCurrency(maxDrawdown)} danger />
          <ProjectionResultCard label="INTEREST LOSS" value={formatCurrency(Math.abs(interestLoss))} />
        </div>

        <div className="flex gap-3">
          <button
            className="w-14 h-14 border rounded-xl"
            title="View projection details"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            🔍
          </button>

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
