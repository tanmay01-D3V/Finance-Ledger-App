import ImpactMetric from "./ImpactMetric";

const SandboxMetrics = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <ImpactMetric
        title="Current Runway"
        value="18"
        unit="mo"
        subtitle="✓ Fully Funded"
        color="text-green-700"
      />

      <ImpactMetric
        title="Stressed Runway"
        value="14"
        unit="mo"
        subtitle="↓ -4 months impact"
        color="text-red-600"
      />

      <ImpactMetric
        title="Burn Rate (Stressed)"
        value="$4,850"
        subtitle="+$620 Monthly Avg"
        color="text-blue-600"
      />

    </div>
  );
};

export default SandboxMetrics;