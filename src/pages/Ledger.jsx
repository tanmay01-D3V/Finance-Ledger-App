import LedgerHeader from "../components/ledger/LedgerHeader";
import IncomeForm from "../components/ledger/IncomeForm";
import ExpenseForm from "../components/ledger/ExpenseForm";
import TransactionTable from "../components/ledger/TransactionHistoryTable";

const Ledger = () => {
  return (
    <div className="p-8 space-y-8">

      <LedgerHeader />

      {/* Forms Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <IncomeForm />
        <ExpenseForm />
      </div>

      {/* Transactions */}
      <TransactionTable />

    </div>
  );
};

export default Ledger;