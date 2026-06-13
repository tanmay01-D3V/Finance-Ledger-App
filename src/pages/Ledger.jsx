import IncomeForm from "../components/ledger/IncomeForm";
import ExpenseForm from "../components/ledger/ExpenseForm";
import TransactionTable from "../components/ledger/TransactionHistoryTable";

const Ledger = () => {
  return (
    <div className="p-8 space-y-8">

      <div className="grid grid-cols-2 sm:grid-cols-2 gap-8 ">
        <IncomeForm />
        <ExpenseForm />
      </div>

      <TransactionTable />

    </div>
  );
};

export default Ledger;