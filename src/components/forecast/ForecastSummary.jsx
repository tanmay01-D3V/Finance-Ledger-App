// Import navigation hook for routing
import { useNavigate } from "react-router-dom";
// Import projection hook for runway and summary data
import { useProjection } from "../../hooks/useProjection";
// Import Zustand store for scenario simulation actions
import { useLedgerStore } from "../../store/useLedgerStore";

// Component displaying three insight cards: efficiency, scenario alpha, and projection summary
const ForecastSummary = () => {
  // Navigation hook for programmatic routing
  const navigate = useNavigate();
  // Retrieve baseline runway, detailed baseline, and currency formatter from projection hook
  const { baselineRunway, baseline, formatCurrency } = useProjection({ projectionMonths: 24 });
  // Get the setScenario action from store for simulation
  const setScenario = useLedgerStore((s) => s.setScenario);

  // Compute net savings rate as percentage of monthly income
  const savingsRate =
    baseline.summary.avgMonthlyIncome > 0
      ? ((baseline.summary.netSavingsRate / baseline.summary.avgMonthlyIncome) * 100).toFixed(1)
      : "0";

  // Define a hypothetical burn reduction amount for the Scenario Alpha card
  const burnReduction = 2000;
  // Estimate extended runway if burn is reduced by the given amount
  const extendedMonths = baselineRunway.isFullyFunded
    ? "indefinitely"
    : baselineRunway.runwayMonths + Math.floor(burnReduction / Math.max(baseline.summary.avgBurnRate, 1));

  // Handler to apply the burn reduction scenario and navigate to sandbox page
  const handleApplySimulation = () => {
    setScenario({ burnReduction: 2000 });
    navigate("/sandbox");
  };

  // Render three-column grid of insight cards
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Card 1: Efficiency Score — shows net savings rate */}
      <div className="bg-white border rounded-3xl p-8">
        <h2 className="text-3xl font-bold mb-4">Efficiency Score</h2>
        <p className="text-gray-600">
          Your current net savings rate is {savingsRate}% of projected monthly income
          {Number(savingsRate) > 0 ? ", indicating healthy capital retention." : "."}
        </p>
        <button className="mt-8 font-semibold">View Audit Details →</button>
      </div>

      {/* Card 2: Scenario Alpha — shows impact of burn reduction */}
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

      {/* Card 3: Projection Insight — plain-language runway assessment */}
      <div className="bg-white border rounded-3xl p-8">
        <h2 className="text-3xl font-bold mb-4">Projection Insight</h2>
        <p className="text-gray-600">
          {baselineRunway.isFullyFunded
            ? "Current trajectory shows positive cashflow with no projected exhaustion."
            : `At current burn of ${formatCurrency(baseline.summary.avgBurnRate)}/mo, reserves last approximately ${Math.floor(baselineRunway.runwayMonths)} months.`}
        </p>
        <button onClick={() => navigate("/dashboard")} className="mt-8 font-semibold">
          View Dashboard →
        </button>
      </div>
    </div>
  );
};

export default ForecastSummary;
