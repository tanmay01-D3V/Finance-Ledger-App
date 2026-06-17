import { useProjection } from "../../hooks/useProjection";

const ForecastMetrics = () => {
  const { baselineRunway, baseline, formatCurrency } = useProjection({
    projectionMonths: 24,
    horizonYears: 3
  });

  const burnRate = baseline.summary.avgBurnRate;
  const netSavings = baseline.summary.netSavingsRate;
  const isLowRisk = baselineRunway.isFullyFunded || baselineRunway.runwayMonths > 12;

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold">Runway Forecast</h1>
          <p className="text-gray-500">
            Strategic long-term visibility for institutional decision making.
          </p>
        </div>

        <div className="bg-gray-100 px-6 py-4 rounded-2xl">
          <p className="text-xs text-gray-500 uppercase">Burn Rate</p>
          <h3 className="text-3xl font-bold">
            {burnRate > 0 ? formatCurrency(burnRate) : formatCurrency(0)}/mo
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border rounded-3xl p-6">
          <p className="text-xs uppercase text-gray-500 mb-3">Projected Exhaustion</p>

          {baselineRunway.isFullyFunded ? (
            <>
              <h2 className="text-5xl font-bold">N/A</h2>
              <div className="mt-6 text-green-700 font-semibold">Fully Funded</div>
            </>
          ) : (
            <>
              <h2 className="text-5xl font-bold">{baselineRunway.exhaustionMonth || "—"}</h2>
              <h2 className="text-5xl font-bold">{baselineRunway.exhaustionYear || ""}</h2>
              <div className="mt-6 text-green-700 font-semibold">{baselineRunway.label}</div>
            </>
          )}
        </div>

        <div className="bg-white border rounded-3xl p-6">
          <div className="flex justify-between">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg">↗</span>
            <span className="text-green-700 text-sm font-semibold">
              {netSavings >= 0 ? "+" : ""}
              {((netSavings / Math.max(baseline.summary.avgMonthlyIncome, 1)) * 100).toFixed(1)}%
            </span>
          </div>

          <h3 className="mt-6 text-gray-500">Net Savings Rate</h3>
          <h2 className="text-4xl font-bold">{formatCurrency(netSavings)}</h2>

          <p className="text-gray-500 mt-6">
            Based on projected monthly net cashflow from ledger averages.
          </p>
        </div>

        <div className="bg-black text-white rounded-3xl p-6">
          <div className="bg-white/10 w-fit px-3 py-2 rounded-lg">✦</div>

          <h3 className="mt-6 text-gray-300">Growth Variance</h3>
          <h2 className="text-4xl font-bold">{isLowRisk ? "Low Risk" : "Elevated Risk"}</h2>

          <p className="mt-8 text-gray-400 text-sm">
            {baselineRunway.isFullyFunded
              ? "Positive cashflow — runway not depleting."
              : `Projected runway: ${Math.floor(baselineRunway.runwayMonths)} months.`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForecastMetrics;
