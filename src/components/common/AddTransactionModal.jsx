import { useState, useEffect } from "react";
import { useLedgerStore } from "../../store/useLedgerStore";
import { FiX, FiCheck, FiDollarSign } from "react-icons/fi";

const AddTransactionModal = ({ isOpen, onClose }) => {
  const { addTransaction, currency } = useLedgerStore();

  const [description, setDescription] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Housing");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("2026-06-13");
  const [status, setStatus] = useState("completed");

  const categories = {
    income: ["Salary", "Consulting", "Freelance", "Investment", "Other"],
    expense: ["Housing", "SaaS", "Groceries", "Utilities", "Marketing", "Travel", "Equipment", "Other"]
  };

  // Reset category when type changes
  useEffect(() => {
    setCategory(categories[type][0]);
  }, [type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || !date) return;

    addTransaction({
      description,
      type,
      category,
      amount: Number(amount),
      date,
      status
    });

    // Reset form and close
    setDescription("");
    setAmount("");
    setDate("2026-06-13");
    setStatus("completed");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 relative z-10 border border-gray-100 shadow-2xl transform scale-100 transition-all duration-300 animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all"
        >
          <FiX size={20} />
        </button>

        {/* Title */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Add Transaction</h3>
          <p className="text-sm text-gray-500 mt-1">
            Enter the transaction details below to update your ledger.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Toggle Type */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-gray-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                type === "expense"
                  ? "bg-white text-rose-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                type === "income"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Income
            </button>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. AWS Cloud Bill"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            />
          </div>

          {/* Amount and Category row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
                  {currency}
                </span>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              >
                {categories[type].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date and Status row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              >
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-4 pt-4 border-t border-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-center text-sm font-semibold rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-black text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition-all shadow-md"
            >
              <FiCheck /> Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
