import SandboxHeader from "../components/sandbox/SandboxHeader";
import SandboxMetrics from "../components/sandbox/SandboxMetrics";
import ScenarioControls from "../components/sandbox/ScenarioControls";
import ScenarioComparisonChart from "../components/sandbox/ScenarioComparisonChart";

const Sandbox = () => {
  return (
    <div className="p-8 space-y-8">

      <SandboxHeader />

      <div className="grid grid-cols-12 gap-6">

        {/* Left Panel */}

        <div className="col-span-12 lg:col-span-4">
          <ScenarioControls />
        </div>

        {/* Right Side */}

        <div className="col-span-12 lg:col-span-8 space-y-6">

          <SandboxMetrics />

          <ScenarioComparisonChart />

        </div>

      </div>

    </div>
  );
};

export default Sandbox;