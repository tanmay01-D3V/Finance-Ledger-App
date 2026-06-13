const ForecastSummary = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <div className="bg-white border rounded-3xl p-8">

        <h2 className="text-3xl font-bold mb-4">
          Efficiency Score
        </h2>

        <p className="text-gray-600">
          Your current capital allocation is
          14% more efficient than industry peers.
        </p>

        <button className="mt-8 font-semibold">
          View Audit Details →
        </button>

      </div>

      <div className="bg-white border rounded-3xl p-8">

        <h2 className="text-3xl font-bold mb-4">
          Scenario Alpha
        </h2>

        <p className="text-gray-600">
          If monthly burn is reduced by $2,000,
          runway extends to February 2026.
        </p>

        <button className="mt-8 font-semibold">
          Apply Simulation →
        </button>

      </div>

      <div className="bg-white border rounded-3xl p-8">

        <h2 className="text-3xl font-bold mb-4">
          AI Projection
        </h2>

        <p className="text-gray-600">
          Predicted revenue uplift in Q4 may
          increase total runway by 3 additional months.
        </p>

        <button className="mt-8 font-semibold">
          Read Analytics →
        </button>

      </div>

    </div>
  );
};

export default ForecastSummary;