import { useProjection } from "../../hooks/useProjection";
import ImpactMetric from "./ImpactMetric";

const SandboxMetrics = () => {
  const { baselineRunway, stressedRunway, baseline, stressed, formatCurrency, runwayImpact } =
    useProjection({ projectionMonths: 24 });

  const formatRunway = (runway) => {
    if (runway.isFullyFunded) return "∞";
    return Math.floor(runway.runwayMonths).toString();
  };

  const burnDiff = stressed.summary.avgBurnRate - baseline.summary.avgBurnRate;
  const impactLabel =
    runwayImpact === 0
      ? "No change"
      : `${runwayImpact > 0 ? "↑" : "↓"} ${Math.abs(Math.floor(runwayImpact))} months impact`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <ImpactMetric
        title="Current Runway"
        value={formatRunway(baselineRunway)}
        unit={baselineRunway.isFullyFunded ? "" : "mo"}
        subtitle={baselineRunway.isFullyFunded ? "✓ Fully Funded" : baselineRunway.label}
        color="text-green-700"
      />

      <ImpactMetric
        title="Stressed Runway"
        value={formatRunway(stressedRunway)}
        unit={stressedRunway.isFullyFunded ? "" : "mo"}
        subtitle={impactLabel}
        color="text-red-600"
      />

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
