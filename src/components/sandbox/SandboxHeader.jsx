const SandboxHeader = () => {
  return (
    <div className="mb-8">

      {/* Row 1 */}

      <h1 className="text-[52px] leading-[58px] font-bold text-gray-900 mb-6">
        Stress Testing Sandbox
      </h1>

      {/* Row 2 */}

      <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] items-start">

        {/* Left Column */}

        <p className="max-w-4xl text-xl leading-9 text-gray-600">
          Experiment with "What-If" scenarios to see how your
          runway holds up against economic volatility and
          unexpected expenses. All changes are temporary until
          saved as a scenario.
        </p>

        {/* Right Column */}

        <div className="flex justify-end gap-4">

          <button
            className="
              px-10 py-5
              border border-gray-300
              rounded-2xl
              text-lg font-semibold
              bg-white
              hover:bg-gray-50
            "
          >
            Reset Simulation
          </button>

          <button
            className="
              px-10 py-5
              bg-black text-white
              rounded-2xl
              text-lg font-semibold
              hover:bg-gray-900
            "
          >
            Save Scenario
          </button>

        </div>

      </div>

    </div>
  );
};

export default SandboxHeader;