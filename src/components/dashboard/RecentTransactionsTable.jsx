import { useFinancialStore } from "../../store/useFinancialStore";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";

const RecentTransactionsTable = () => {
  const { transactions, currency } = useFinancialStore();

  // Slice the latest 5 transactions
  const recentTx = transactions.slice(0, 5);

  return (
    <div className="mx-8 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Recent Transactions
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Overview of the latest cash flows in and out.
          </p>
        </div>
        <Link
          to="/ledger"
          className="text-xs font-semibold px-4 py-2 rounded-xl bg-gray-50 hover:bg-black hover:text-white transition-all duration-300 border border-gray-100"
        >
          View Ledger
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 rounded-xl">
            <tr>
              <th className="px-6 py-4 font-semibold">Description</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recentTx.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-400 font-medium">
                  No transactions found. Add a transaction to get started.
                </td>
              </tr>
            ) : (
              recentTx.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-all">
                  <td className="px-6 py-4 font-semibold text-gray-900 flex items-center gap-3">
                    <span
                      className={`p-2 rounded-xl flex items-center justify-center ${
                        tx.type === "income"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {tx.type === "income" ? (
                        <FiArrowUpRight size={16} />
                      ) : (
                        <FiArrowDownRight size={16} />
                      )}
                    </span>
                    {tx.description}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {tx.category}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(tx.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}
                  </td>
                  <td
                    className={`px-6 py-4 font-bold text-base ${
                      tx.type === "income"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}
                    {currency}
                    {tx.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
                        tx.status === "completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactionsTable;