import { FiTrendingUp } from "react-icons/fi";

const IncomeForm = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">

      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">
          <FiTrendingUp className="text-green-700 text-3xl" />
        </div>

        <h2 className="text-4xl font-bold text-gray-900">
          Add Income
        </h2>
      </div>

      {/* Form */}
      <div className="grid grid-cols-2 gap-6">

        {/* Source Name */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Source Name
          </label>

          <input
            type="text"
            placeholder="e.g. SaaS Subscription"
            className="w-full h-16 px-5 text-2xl rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Amount ($)
          </label>

          <input
            type="number"
            placeholder="0.00"
            className="w-full h-16 px-5 text-2xl rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Type
          </label>

          <select
            className="w-full h-16 px-5 text-2xl rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option>Fixed</option>
            <option>Recurring</option>
            <option>Bonus</option>
            <option>Freelance</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Date
          </label>

          <input
            type="date"
            className="w-full h-16 px-5 text-2xl rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

      </div>

      {/* Button */}
      <button
        className="w-full mt-8 h-16 bg-green-700 hover:bg-green-800 text-white text-xl font-semibold rounded-2xl transition"
      >
        Record Income
      </button>

    </div>
  );
};

export default IncomeForm;