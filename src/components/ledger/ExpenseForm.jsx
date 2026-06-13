import { FiTrendingDown } from "react-icons/fi";

const ExpenseForm = () => {
  return (
    <div className="h-200px w-200px bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">

      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center">
          <FiTrendingDown className="text-red-700 text-3xl" />
        </div>

        <h2 className="text-4xl font-bold text-gray-900">
          Add Expense
        </h2>
      </div>

      {/* Form */}
      <div className="grid grid-cols-2 gap-6">

        {/* Expense Name */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Expense Name
          </label>

          <input
            type="text"
            placeholder="e.g. AWS Cloud Fees"
            className="w-full h-16 px-5 text-xl rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
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
            className="w-full h-16 px-5 text-xl rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Category
          </label>

          <select
            className="w-full h-16 px-5 text-xl rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option>Variable (Usage)</option>
            <option>Fixed</option>
            <option>Housing</option>
            <option>Food</option>
            <option>Transport</option>
            <option>Entertainment</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Date
          </label>

          <input
            type="date"
            className="w-full h-16 px-5 text-xl rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

      </div>

      {/* Button */}
      <button
        className="w-full mt-8 h-16 bg-black hover:bg-gray-900 text-white text-xl font-semibold rounded-2xl transition"
      >
        Record Expense
      </button>

    </div>
  );
};

export default ExpenseForm;