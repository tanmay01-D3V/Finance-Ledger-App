import { useMemo, useState } from "react";
import { useLedgerStore } from "../../store/useLedgerStore";
import { amortize } from "../../utils/amortize.js";
import { FiX, FiChevronLeft, FiChevronRight, FiDollarSign, FiDownload } from "react-icons/fi";

const LoanAmortizationModal = ({ loan, isOpen, onClose }) => {
  const { currency } = useLedgerStore();

  const { monthlyPayment, schedule, totalInterest } = useMemo(
    () => loan ? amortize(loan) : { monthlyPayment: 0, schedule: [], totalInterest: 0 },
    [loan]
  );

  const [currentPage, setCurrentPage] = useState(0);

  if (!isOpen || !loan) return null;

  const formatMonth = (yyyyMm) => {
    if (!yyyyMm) return "N/A";
    const [year, month] = yyyyMm.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString(undefined, { month: "short", year: "numeric" });
  };

  const rowsPerPage = 12;
  const totalPages = Math.ceil(schedule.length / rowsPerPage);
  const paginatedSchedule = schedule.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

  const formatCurrency = (val) =>
    `${currency}${Math.abs(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleExport = () => {
    const headers = ["Month", "Payment", "Principal", "Interest", "Balance"];
    const rows = schedule.map((row) => [
      formatMonth(row.monthKey),
      formatCurrency(row.payment),
      formatCurrency(row.principal),
      formatCurrency(row.interest),
      formatCurrency(row.balance)
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `loan-amortization-${loan.id}.csv`;
    link.click();
  };

  if (!isOpen || !loan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="bg-white rounded-3xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] relative z-10 border border-gray-100 shadow-2xl transform scale-100 transition-all duration-300 animate-scale-up flex flex-col">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-50 rounded-2xl text-gray-500">
              <FiDollarSign size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Amortization Schedule</h3>
              <p className="text-sm text-gray-500 mt-1">Loan: {loan.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all flex items-center gap-1"
              title="Export CSV"
            >
              <FiDownload size={18} />
              <span className="hidden sm:inline text-sm font-medium">Export</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs text-gray-500">Principal</p>
            <p className="text-xl font-bold text-gray-900">{currency}{Number(loan.principal).toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs text-gray-500">Annual Rate</p>
            <p className="text-xl font-bold text-gray-900">{loan.annualRate}%</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs text-gray-500">Monthly Payment</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(monthlyPayment)}</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs text-gray-500">Total Interest</p>
            <p className="text-xl font-bold text-rose-600">{formatCurrency(totalInterest)}</p>
          </div>
        </div>

        <div className="overflow-x-auto flex-1 min-h-0">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 sticky top-0">
              <tr>
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Month</th>
                <th className="px-4 py-3 font-semibold">Payment</th>
                <th className="px-4 py-3 font-semibold">Principal</th>
                <th className="px-4 py-3 font-semibold">Interest</th>
                <th className="px-4 py-3 font-semibold">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedSchedule.map((row, idx) => (
                <tr key={row.monthIndex} className="hover:bg-gray-50/50 transition-all">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {currentPage * rowsPerPage + idx + 1}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{formatMonth(row.monthKey)}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(row.payment)}</td>
                  <td className="px-4 py-3 text-emerald-600 font-medium">{formatCurrency(row.principal)}</td>
                  <td className="px-4 py-3 text-rose-600 font-medium">{formatCurrency(row.interest)}</td>
                  <td className="px-4 py-3 text-gray-600 font-medium">{formatCurrency(row.balance)}</td>
                </tr>
              ))}
              {schedule.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No schedule data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Page {currentPage + 1} of {totalPages} ({schedule.length} payments total)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="w-10 h-10 border rounded-xl flex items-center justify-center disabled:opacity-30 hover:bg-gray-50 transition-colors"
              >
                <FiChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
                className="w-10 h-10 border rounded-xl flex items-center justify-center disabled:opacity-30 hover:bg-gray-50 transition-colors"
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanAmortizationModal;