import DashboardHeader from "../components/dashboard/DashboardHeader";
import MetricsGrid from "../components/dashboard/MetricsGrid";
import ChartsGrid from "../components/dashboard/ChartGrid";
import RecentTransactionsTable from "../components/dashboard/RecentTransactionsTable";

const Dashboard = () => {
  return (
    <div className="space-y-8">

      <DashboardHeader />

      <MetricsGrid />

      <ChartsGrid />

      <RecentTransactionsTable />

    </div>
  );
};

export default Dashboard;