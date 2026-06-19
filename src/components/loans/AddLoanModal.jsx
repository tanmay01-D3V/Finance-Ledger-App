import { useState } from "react";
import { useLedgerStore } from "../../store/useLedgerStore";
import { amortize } from "../../utils/amortize.js";
import { FiX, FiCheck, FiDollarSign, FiPercent } from "react-icons/fi";

const AddLoanModal = ({ isOpen, onClose }) => {
  const { addLoan, currency } = useLedgerStore();

  const [principal, setPrincipal] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [termMonths, setTermMonths] = useState("");
  const [startMonth, setStartMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [errors, setErrors] = useState({});

  const { monthlyPayment, totalInterest } = principal && annualRate && termMonths
    ? amortize({ principal: Number(principal), annualRate: Number(annualRate), termMonths: Number(termMonths), startMonth })
    : { monthlyPayment: 0, totalInterest: 0 };

  const validate = () => {
    const newErrors = {};
    if (!principal || Number(principal) <= 0) newErrors.principal = "Principal must be greater than 0";
    if (!annualRate || Number(annualRate) < 0) newErrors.annualRate = "Annual rate must be >= 0";
    if (!termMonths || Number(termMonths) <= 0) newErrors.termMonths = "Term must be greater than 0";
    if (!startMonth) newErrors.startMonth = "Start month is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    addLoan({
      principal: Number(principal),
      annualRate: Number(annualRate),
      termMonths: Number(termMonths),
      startMonth
    });

    setPrincipal("");
    setAnnualRate("");
    setTermMonths("");
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 relative z-10 border border-gray-100 shadow-2xl transform scale-100 transition-all duration-300 animate-scale-up">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all"
        >
          <FiX size={20} />
        </button>

        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Add Loan</h3>
          <p className="text-sm text-gray-500 mt-1">
            Enter loan details to include in your cashflow projection.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Principal Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
                {currency}
              </span>
              <input
                type="number"
                required
                min="0.01"
                step="any"
                value={principal}
                onChange={(e) => { setPrincipal(e.target.value); if (errors.principal) setErrors({...errors, principal: ""}); }}
                placeholder="e.g. 250000"
                className={`w-full pl-9 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:border-transparent transition-all ${
                  errors.principal ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-black"
                }`}
              />
            </div>
            {errors.principal && <p className="text-xs text-red-500">{errors.principal}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Annual Rate (%)</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  value={annualRate}
                  onChange={(e) => { setAnnualRate(e.target.value); if (errors.annualRate) setErrors({...errors, annualRate: ""}); }}
                  placeholder="5.5"
                  className={`w-full pr-10 py-3 border rounded-xl outline-none focus:ring-2 focus:border-transparent transition-all ${
                    errors.annualRate ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-black"
                  }`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">%</span>
              </div>
              {errors.annualRate && <p className="text-xs text-red-500">{errors.annualRate}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Term (Months)</label>
              <input
                type="number"
                required
                min="1"
                step="1"
                value={termMonths}
                onChange={(e) => { setTermMonths(e.target.value); if (errors.termMonths) setErrors({...errors, termMonths: ""}); }}
                placeholder="360"
                className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:border-transparent transition-all ${
                  errors.termMonths ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-black"
                }`}
              />
              {errors.termMonths && <p className="text-xs text-red-500">{errors.termMonths}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Start Month</label>
            <input
              type="month"
              required
              value={startMonth}
              onChange={(e) => { setStartMonth(e.target.value); if (errors.startMonth) setErrors({...errors, startMonth: ""}); }}
              className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:border-transparent transition-all ${
                errors.startMonth ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-black"
              }`}
            />
            {errors.startMonth && <p className="text-xs text-red-500">{errors.startMonth}</p>}
          </div>

          {(monthlyPayment > 0 || totalInterest > 0) && (
            <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Preview</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500">Monthly Payment</p>
                  <p className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <FiDollarSign size={20} className="text-gray-400" />
                    {currency}{Number(monthlyPayment).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500">Total Interest</p>
                  <p className="text-2xl font-bold text-rose-600 flex items-center gap-2">
                    <FiPercent size={20} className="text-rose-400" />
                    {currency}{Number(totalInterest).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          )}

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
              <FiCheck /> Add Loan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLoanModal;