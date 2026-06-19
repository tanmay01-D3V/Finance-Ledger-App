// Import projection hook for baseline and stressed scenario data
import { useProjection } from "../../hooks/useProjection";
// Import reusable metric display component
import ImpactMetric from "./ImpactMetric";

// Component displaying three key metrics comparing baseline vs stressed scenario
const SandboxMetrics = () => {
  // Destructure all relevant fields from the projection hook (24-month horizon)
  const { baselineRunway, stressedRunway, baseline, stressed, formatCurrency, runwayImpact } =
    useProjection({ projectionMonths: 24 });

  // Helper: format runway value — infinity symbol if fully funded, otherwise integer months
  const formatRunway = (runway) => {
    if (runway.isFullyFunded) return "∞";
    return Math.floor(runway.runwayMonths).toString();
  };

  // Compute difference in average monthly burn between stressed and baseline
  const burnDiff = stressed.summary.avgBurnRate - baseline.summary.avgBurnRate;
  // Generate human-readable impact label with directional arrow
  const impactLabel =
    runwayImpact === 0
      ? "No change"
      : `${runwayImpact > 0 ? "↑" : "↓"} ${Math.abs(Math.floor(runwayImpact))} months impact`;

  // Render three ImpactMetric cards in a responsive grid
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Card 1: Baseline (current) runway */}
      <ImpactMetric
        title="Current Runway"
        value={formatRunway(baselineRunway)}
        unit={baselineRunway.isFullyFunded ? "" : "mo"}
        subtitle={baselineRunway.isFullyFunded ? "✓ Fully Funded" : baselineRunway.label}
        color="text-green-700"
      />

      {/* Card 2: Stressed runway with impact delta */}
      <ImpactMetric
        title="Stressed Runway"
        value={formatRunway(stressedRunway)}
        unit={stressedRunway.isFullyFunded ? "" : "mo"}
        subtitle={impactLabel}
        color="text-red-600"
      />

      {/* Card 3: Stressed burn rate vs baseline */}
      <ImpactMetric
        title="Burn Rate (Stressed)"
        value={formatCurrency(stressed.summary.avgBurnRate || stressed.summary.avgMonthlyExpense)}
        subtitle={`${burnDiff >= 0 ? "+" : ""}${formatCurrency(burnDiff)} Monthly Avg`}
        color="text-blue-600"
      />
    </div>
  );
};

export default SandboxMetrics;
