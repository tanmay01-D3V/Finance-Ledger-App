// Import React state hook
import { useState } from "react";
// Import Zustand store for adding loans
import { useLedgerStore } from "../../store/useLedgerStore";
// Import amortization utility for computing payment schedules
import { amortize } from "../../utils/amortize.js";
// Import Feather icons
import { FiX, FiCheck, FiDollarSign, FiPercent } from "react-icons/fi";

// Modal component for adding a new loan with form validation and preview
const AddLoanModal = ({ isOpen, onClose }) => {
  // Destructure addLoan action and currency from store
  const { addLoan, currency } = useLedgerStore();

  // Form field states
  const [principal, setPrincipal] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [termMonths, setTermMonths] = useState("");
  // Default start month to current month
  const [startMonth, setStartMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  // Per-field validation error messages
  const [errors, setErrors] = useState({});

  // Compute amortization preview whenever inputs change (only if all fields filled)
  const { monthlyPayment, totalInterest } = principal && annualRate && termMonths
    ? amortize({ principal: Number(principal), annualRate: Number(annualRate), termMonths: Number(termMonths), startMonth })
    : { monthlyPayment: 0, totalInterest: 0 };

  // Validate all form fields before submission
  const validate = () => {
    const newErrors = {};
    if (!principal || Number(principal) <= 0) newErrors.principal = "Principal must be greater than 0";
    if (!annualRate || Number(annualRate) < 0) newErrors.annualRate = "Annual rate must be >= 0";
    if (!termMonths || Number(termMonths) <= 0) newErrors.termMonths = "Term must be greater than 0";
    if (!startMonth) newErrors.startMonth = "Start month is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission: validate, add loan to store, reset fields, close modal
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    addLoan({
      principal: Number(principal),
      annualRate: Number(annualRate),
      termMonths: Number(termMonths),
      startMonth
    });

    // Reset form state after successful submission
    setPrincipal("");
    setAnnualRate("");
    setTermMonths("");
    setErrors({});
    onClose();
  };

  // Do not render anything if modal is closed
  if (!isOpen) return null;

  // Render modal overlay and form
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Semi-transparent backdrop — clicking it closes the modal */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal content card */}
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 relative z-10 border border-gray-100 shadow-2xl transform scale-100 transition-all duration-300 animate-scale-up">
        {/* Close button (top-right) */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all"
        >
          <FiX size={20} />
        </button>

        {/* Modal header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Add Loan</h3>
          <p className="text-sm text-gray-500 mt-1">
            Enter loan details to include in your cashflow projection.
          </p>
        </div>

        {/* Loan form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Principal amount input with currency prefix */}
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
            {/* Validation error message */}
            {errors.principal && <p className="text-xs text-red-500">{errors.principal}</p>}
          </div>

          {/* Two-column grid for annual rate and term */}
          <div className="grid grid-cols-2 gap-4">
            {/* Annual rate input */}
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

            {/* Term in months input */}
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

          {/* Start month picker */}
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

          {/* Preview section — shows computed monthly payment and total interest */}
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

          {/* Action buttons: Cancel and Submit */}
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