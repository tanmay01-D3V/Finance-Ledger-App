import { useState } from "react";
import { FiTrendingUp } from "react-icons/fi";
import { useLedgerStore } from "../../store/useLedgerStore";

const IncomeForm = () => {
  const { addTransaction, currency } = useLedgerStore();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Salary");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    addTransaction({
      description,
      type: "income",
      category,
      amount: Number(amount),
      date,
      status: "completed"
    });

    setDescription("");
    setAmount("");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">
          <FiTrendingUp className="text-green-700 text-3xl" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900">Add Income</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Source Name</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. SaaS Subscription"
            className="w-full h-16 px-5 text-2xl rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Amount ({currency})
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0.01"
            step="any"
            className="w-full h-16 px-5 text-2xl rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Type</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-16 px-5 text-2xl rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="Salary">Salary</option>
            <option value="Consulting">Consulting</option>
            <option value="Freelance">Freelance</option>
            <option value="Investment">Investment</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full h-16 px-5 text-2xl rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <button
          type="submit"
          className="col-span-2 w-full mt-2 h-16 bg-green-700 hover:bg-green-800 text-white text-xl font-semibold rounded-2xl transition"
        >
          Record Income
        </button>
      </form>
    </div>
  );
};

export default IncomeForm;
