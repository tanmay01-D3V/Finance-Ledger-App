import CashflowForecastChart from "./CashflowForecastChart";
import IncomeExpenseChart from "./IncomeExpenseChart";

const ChartsGrid = () => {
  return (
    <div className="px-8 grid grid-cols-2 gap-6">

      <CashflowForecastChart />

      <IncomeExpenseChart />

    </div>
  );
};

export default ChartsGrid;