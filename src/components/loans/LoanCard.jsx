import { useLedgerStore } from "../../store/useLedgerStore";
import { amortize } from "../../utils/amortize.js";
import { FiDollarSign, FiPercent, FiCalendar, FiTrash2, FiExternalLink } from "react-icons/fi";

const LoanCard = ({ loan, onViewSchedule, onDelete }) => {
  const { currency } = useLedgerStore();

  const { monthlyPayment, totalInterest, schedule } = amortize(loan);

  const monthsRemaining = schedule.length;
  const yearsRemaining = (monthsRemaining / 12).toFixed(1);

  const formatMonth = (yyyyMm) => {
    if (!yyyyMm) return "N/A";
    const [year, month] = yyyyMm.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString(undefined, { month: "short", year: "numeric" });
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gray-50 rounded-2xl text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-900 transition-all duration-300">
            <FiDollarSign size={24} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900">Loan</h4>
            <p className="text-xs text-gray-500">{loan.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onViewSchedule?.(loan)}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all"
            title="View schedule"
          >
            <FiExternalLink size={16} />
          </button>
          <button
            onClick={() => onDelete?.(loan.id)}
            className="p-2 rounded-xl text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
            title="Delete loan"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Principal</p>
          <p className="text-xl font-bold text-gray-900 flex items-center gap-1">
            <FiDollarSign size={16} className="text-gray-400" />
            {currency}{Number(loan.principal).toLocaleString()}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Annual Rate</p>
          <p className="text-xl font-bold text-gray-900 flex items-center gap-1">
            <FiPercent size={16} className="text-gray-400" />
            {loan.annualRate}%
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Term</p>
          <p className="text-xl font-bold text-gray-900 flex items-center gap-1">
            <FiCalendar size={16} className="text-gray-400" />
            {loan.termMonths} months ({yearsRemaining} yrs)
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Start Month</p>
          <p className="text-xl font-bold text-gray-900 flex items-center gap-1">
            <FiCalendar size={16} className="text-gray-400" />
            {formatMonth(loan.startMonth)}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 mt-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs text-gray-500">Monthly Payment</p>
            <p className="text-2xl font-bold text-gray-900">
              {currency}{Number(monthlyPayment).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs text-gray-500">Total Interest</p>
            <p className="text-2xl font-bold text-rose-600">
              {currency}{Number(totalInterest).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{monthsRemaining}</span> payments remaining
          </div>
          <button
            onClick={() => onViewSchedule?.(loan)}
            className="text-sm font-semibold text-black hover:text-gray-700 flex items-center gap-1"
          >
            View Schedule <FiExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanCard;