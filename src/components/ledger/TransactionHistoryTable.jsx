// Import React hooks for state management and refs
import { useState, useRef } from "react";
// Import Feather icons for UI elements
import {
  FiCheckCircle,
  FiClock,
  FiCalendar,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiTrash2
} from "react-icons/fi";
// Import Zustand store for transaction actions
import { useLedgerStore } from "../../store/useLedgerStore";
// Import encrypted export/download utility
import { downloadEncryptedExport } from "../../utils/encryptExport";

// Number of transactions displayed per page
const PAGE_SIZE = 10;

// Component displaying paginated transaction history table with export/import controls
const TransactionHistoryTable = () => {
  // Destructure store state and actions
  const { transactions, currency, deleteTransaction, exportLedger, importEncryptedLedger } =
    useLedgerStore();
  // Current page index for pagination
  const [page, setPage] = useState(0);
  // Active category filter, defaults to "all"
  const [categoryFilter, setCategoryFilter] = useState("all");
  // Reference to the hidden file input for import
  const fileInputRef = useRef(null);

  // Derive unique category list from transactions, prepend "all" option
  const categories = ["all", ...new Set(transactions.map((t) => t.category))];

  // Filter transactions by selected category
  const filtered = transactions.filter(
    (t) => categoryFilter === "all" || t.category === categoryFilter
  );

  // Compute pagination boundaries
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const pageItems = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  // Export handler: prompts for passphrase, then downloads encrypted ledger file
  const handleExport = () => {
    const passphrase = window.prompt("Enter a passphrase to encrypt your export:");
    if (!passphrase) return;
    downloadEncryptedExport(exportLedger(), passphrase);
  };

  // Import handler: reads a selected file, prompts for passphrase, decrypts and loads into store
  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const passphrase = window.prompt("Enter the passphrase to decrypt this file:");
    if (!passphrase) return;

    // Use FileReader to read file contents as text
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        // Attempt to import decrypted data into the store
        importEncryptedLedger(ev.target.result, passphrase);
        alert("Ledger imported successfully.");
      } catch (err) {
        alert(err.message || "Import failed.");
      }
    };
    reader.readAsText(file);
    // Reset file input so the same file can be re-imported
    e.target.value = "";
  };

  // Render the full table with toolbar, headers, rows, and pagination
  return (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
      {/* Toolbar: title, filters, export/import buttons */}
      <div className="flex justify-between items-center p-8 border-b">
        <h2 className="text-4xl font-bold">Transaction History</h2>

        <div className="flex gap-4">
          {/* Placeholder date filter button */}
          <button className="flex items-center gap-2 px-5 py-3 border rounded-full">
            <FiCalendar />
            All Time
          </button>

          {/* Category dropdown filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(0);
            }}
            className="flex items-center gap-2 px-5 py-3 border rounded-full bg-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>

          {/* Export button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-3 border rounded-full hover:bg-gray-50"
          >
            <FiDownload />
            Export
          </button>

          {/* Import button triggers hidden file input */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-5 py-3 border rounded-full hover:bg-gray-50"
          >
            Import
          </button>
          {/* Hidden file input for importing .cfr files */}
          <input ref={fileInputRef} type="file" accept=".cfr,.txt" hidden onChange={handleImport} />
        </div>
      </div>

      {/* Transactions table */}
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr className="text-left">
            <th className="p-6">DATE</th>
            <th className="p-6">DESCRIPTION</th>
            <th className="p-6">CATEGORY</th>
            <th className="p-6">AMOUNT</th>
            <th className="p-6">STATUS</th>
            <th className="p-6"></th>
          </tr>
        </thead>

        <tbody>
          {/* Empty state when no transactions match filter */}
          {pageItems.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-8 text-center text-gray-400">
                No transactions found.
              </td>
            </tr>
          ) : (
            // Map over paginated items to render rows
            pageItems.map((item) => (
              <tr key={item.id} className="border-t">
                {/* Formatted date */}
                <td className="p-6 text-xl">
                  {new Date(item.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}
                </td>

                {/* Description and type label */}
                <td className="p-6">
                  <p className="font-bold text-xl">{item.description}</p>
                  <p className="text-gray-500 capitalize">{item.type}</p>
                </td>

                {/* Category badge with income/expense color */}
                <td className="p-6">
                  <span
                    className={`px-4 py-2 rounded-full font-medium ${
                      item.type === "income"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.type === "income" ? "Income" : "Expense"}: {item.category}
                  </span>
                </td>

                {/* Amount with sign and currency */}
                <td
                  className={`p-6 text-2xl font-bold ${
                    item.type === "income" ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {item.type === "income" ? "+" : "-"}
                  {currency}
                  {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>

                {/* Status icon: checkmark for completed, clock for pending */}
                <td className="p-6">
                  {item.status === "completed" ? (
                    <FiCheckCircle className="text-green-700" size={28} />
                  ) : (
                    <FiClock className="text-gray-400" size={28} />
                  )}
                </td>

                {/* Delete action */}
                <td className="p-6">
                  <button
                    onClick={() => deleteTransaction(item.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition"
                    title="Delete transaction"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination footer */}
      <div className="flex justify-between items-center p-8 border-t">
        {/* Record count indicator */}
        <p className="text-gray-600 font-medium">
          Showing {filtered.length === 0 ? 0 : currentPage * PAGE_SIZE + 1} to{" "}
          {Math.min((currentPage + 1) * PAGE_SIZE, filtered.length)} of {filtered.length} entries
        </p>

        {/* Previous / Next page controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="w-12 h-12 border rounded-xl flex items-center justify-center disabled:opacity-30"
          >
            <FiChevronLeft />
          </button>

          <span className="px-4 font-semibold">
            {currentPage + 1} / {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage >= totalPages - 1}
            className="w-12 h-12 border rounded-xl flex items-center justify-center disabled:opacity-30"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryTable;
