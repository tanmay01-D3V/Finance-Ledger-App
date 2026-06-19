import { useState } from "react";
import { useLedgerStore } from "../store/useLedgerStore";

import LoansHeader from "../components/loans/LoansHeader";
import LoanCard from "../components/loans/LoanCard";
import AddLoanModal from "../components/loans/AddLoanModal";
import LoanAmortizationModal from "../components/loans/LoanAmortizationModal";

const Loans = () => {
  const { loans, deleteLoan } = useLedgerStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const handleAddLoan = () => setShowAddModal(true);
  const handleViewSchedule = (loan) => setSelectedLoan(loan);
  const handleDeleteLoan = (id) => {
    if (window.confirm("Delete this loan? This cannot be undone.")) {
      deleteLoan(id);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <LoansHeader onAddLoan={handleAddLoan} />

      {loans.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 w-fit mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <line x1="6" y1="8" x2="18" y2="8" />
              <line x1="6" y1="12" x2="18" y2="12" />
              <line x1="6" y1="16" x2="18" y2="16" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No loans yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Add your first loan to see it factored into your cashflow projections
            and runway calculations.
          </p>
          <button
            onClick={handleAddLoan}
            className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-900 transition-colors"
          >
            Add Your First Loan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loans.map((loan) => (
            <LoanCard
              key={loan.id}
              loan={loan}
              onViewSchedule={handleViewSchedule}
              onDelete={handleDeleteLoan}
            />
          ))}
        </div>
      )}

      <AddLoanModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      <LoanAmortizationModal
        loan={selectedLoan}
        isOpen={!!selectedLoan}
        onClose={() => setSelectedLoan(null)}
      />
    </div>
  );
};

export default Loans;