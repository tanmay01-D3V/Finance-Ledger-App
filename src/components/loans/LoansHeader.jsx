import { FiDollarSign } from "react-icons/fi";

const LoansHeader = ({ onAddLoan }) => {
  return (
    <div className="mb-8">
      <h1 className="text-[52px] leading-[58px] font-bold text-gray-900">
        Loans
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] mt-6">
        <p className="max-w-4xl text-xl leading-9 text-gray-600">
          Manage your loans and view amortization schedules. Loans are automatically
          factored into your cashflow projections and runway calculations.
        </p>
        <div className="flex justify-end">
          <button
            onClick={onAddLoan}
            className="px-10 py-5 bg-black text-white rounded-2xl text-lg font-semibold hover:bg-gray-900 transition-colors flex items-center gap-2"
          >
            <FiDollarSign size={20} />
            Add Loan
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoansHeader;