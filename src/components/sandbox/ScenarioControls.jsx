import { useState } from "react";

const ScenarioControls = () => {
  const [inflation, setInflation] = useState(3.2);
  const [jobLoss, setJobLoss] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-8 h-full">

      <h2 className="text-4xl font-bold mb-10">
        Scenario Controls
      </h2>

      {/* Inflation */}

      <div className="mb-10">

        <div className="flex justify-between mb-4">
          <span className="font-semibold text-lg">
            Inflation Rate (Annual)
          </span>

          <span className="text-4xl font-bold">
            {inflation}%
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="15"
          step="0.1"
          value={inflation}
          onChange={(e) =>
            setInflation(e.target.value)
          }
          className="w-full"
        />

        <div className="flex justify-between text-gray-500 text-sm mt-2">
          <span>STABLE (0%)</span>
          <span>HYPER (15%)</span>
        </div>

      </div>

      {/* Emergency Expense */}

      <div className="mb-10">

        <label className="block text-lg font-semibold mb-3">
          One-time Emergency Expense
        </label>

        <input
          type="number"
          defaultValue="15000"
          className="w-full border rounded-xl p-4 text-xl"
        />

        <p className="text-gray-500 italic mt-3">
          Applied to the first month of simulation.
        </p>

      </div>

      {/* Job Loss */}

      <div className="border border-red-200 bg-red-50 rounded-2xl p-5 mb-10">

        <div className="flex justify-between items-center">

          <div>
            <h4 className="font-semibold text-lg">
              Simulate Job Loss
            </h4>

            <p className="text-gray-600">
              Stops primary income in month 3
            </p>
          </div>

          <button
            onClick={() => setJobLoss(!jobLoss)}
            className={`w-14 h-8 rounded-full transition ${
              jobLoss
                ? "bg-red-500"
                : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white h-6 w-6 rounded-full transition ${
                jobLoss
                  ? "translate-x-7"
                  : "translate-x-1"
              }`}
            />
          </button>

        </div>

      </div>

      {/* Info Box */}

      <div className="bg-gray-100 rounded-2xl p-5 text-gray-600 leading-relaxed">

        Adjusting these parameters will update the
        stressed forecast in real time.

        Impact metrics are calculated against
        your baseline ledger.

      </div>

    </div>
  );
};

export default ScenarioControls;