import { useNavigate } from "react-router-dom";
import { useProjection } from "../../hooks/useProjection";
import { useLedgerStore } from "../../store/useLedgerStore";

const ForecastSummary = () => {
  const navigate = useNavigate();
  const { baselineRunway, baseline, formatCurrency } = useProjection({ projectionMonths: 24 });
  const setScenario = useLedgerStore((s) => s.setScenario);

  const savingsRate =
    baseline.summary.avgMonthlyIncome > 0
      ? ((baseline.summary.netSavingsRate / baseline.summary.avgMonthlyIncome) * 100).toFixed(1)
      : "0";

  const burnReduction = 2000;
  const extendedMonths = baselineRunway.isFullyFunded
    ? "indefinitely"
    : baselineRunway.runwayMonths + Math.floor(burnReduction / Math.max(baseline.summary.avgBurnRate, 1));

  const handleApplySimulation = () => {
    setScenario({ burnReduction: 2000 });
    navigate("/sandbox");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white border rounded-3xl p-8">
        <h2 className="text-3xl font-bold mb-4">Efficiency Score</h2>
        <p className="text-gray-600">
          Your current net savings rate is {savingsRate}% of projected monthly income
          {Number(savingsRate) > 0 ? ", indicating healthy capital retention." : "."}
        </p>
        <button className="mt-8 font-semibold">View Audit Details →</button>
      </div>

      <div className="bg-white border rounded-3xl p-8">
        <h2 className="text-3xl font-bold mb-4">Scenario Alpha</h2>
        <p className="text-gray-600">
          If monthly burn is reduced by {formatCurrency(2000)}, runway extends to{" "}
          {typeof extendedMonths === "number"
            ? `${Math.floor(extendedMonths)} months`
            : extendedMonths}
          .
        </p>
        <button onClick={handleApplySimulation} className="mt-8 font-semibold">
          Apply Simulation →
        </button>
      </div>

      <div className="bg-white border rounded-3xl p-8">
        <h2 className="text-3xl font-bold mb-4">Projection Insight</h2>
        <p className="text-gray-600">
          {baselineRunway.isFullyFunded
            ? "Current trajectory shows positive cashflow with no projected exhaustion."
            : `At current burn of ${formatCurrency(baseline.summary.avgBurnRate)}/mo, reserves last approximately ${Math.floor(baselineRunway.runwayMonths)} months.`}
        </p>
        <button onClick={() => navigate("/forecast")} className="mt-8 font-semibold">
          Read Analytics →
        </button>
      </div>
    </div>
  );
};

export default ForecastSummary;
