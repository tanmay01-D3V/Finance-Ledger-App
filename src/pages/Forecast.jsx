import ForecastMetrics from "../components/forecast/ForeCastMetrics";
import RunwayChart from "../components/forecast/RunwayChart";
import ForecastSummary from "../components/forecast/ForecastSummary";

const Forecast = () => {
  return (
    <div className="p-8 space-y-6">

      <ForecastMetrics />

      <RunwayChart />

      <ForecastSummary />

    </div>
  );
};

export default Forecast;