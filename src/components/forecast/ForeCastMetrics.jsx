const ForecastMetrics = () => {
  return (
    <div>

      {/* Heading */}

      <div className="flex justify-between items-start mb-6">

        <div>
          <h1 className="text-4xl font-bold">
            Runway Forecast
          </h1>

          <p className="text-gray-500">
            Strategic long-term visibility for institutional decision making.
          </p>
        </div>

        <div className="bg-gray-100 px-6 py-4 rounded-2xl">
          <p className="text-xs text-gray-500 uppercase">
            Burn Rate
          </p>

          <h3 className="text-3xl font-bold">
            $14,200/mo
          </h3>
        </div>

      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Exhaustion */}

        <div className="bg-white border rounded-3xl p-6">

          <p className="text-xs uppercase text-gray-500 mb-3">
            Projected Exhaustion
          </p>

          <h2 className="text-5xl font-bold">
            October
          </h2>

          <h2 className="text-5xl font-bold">
            2025
          </h2>

          <div className="mt-6 text-green-700 font-semibold">
            18 Months Remaining
          </div>

        </div>

        {/* Savings */}

        <div className="bg-white border rounded-3xl p-6">

          <div className="flex justify-between">

            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg">
              ↗
            </span>

            <span className="text-green-700 text-sm font-semibold">
              +12.4%
            </span>

          </div>

          <h3 className="mt-6 text-gray-500">
            Net Savings Rate
          </h3>

          <h2 className="text-4xl font-bold">
            $8,450
          </h2>

          <p className="text-gray-500 mt-6">
            Optimized by 4.2% since last quarter audit.
          </p>

        </div>

        {/* Risk */}

        <div className="bg-black text-white rounded-3xl p-6">

          <div className="bg-white/10 w-fit px-3 py-2 rounded-lg">
            ✦
          </div>

          <h3 className="mt-6 text-gray-300">
            Growth Variance
          </h3>

          <h2 className="text-4xl font-bold">
            Low Risk
          </h2>

          <p className="mt-8 text-gray-400 text-sm">
            Projection confidence interval: 98.2%
          </p>

        </div>

      </div>

    </div>
  );
};

export default ForecastMetrics;