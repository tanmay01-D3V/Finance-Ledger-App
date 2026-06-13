import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const MetricCard = ({
  title,
  value,
  change,
  positive = true,
  icon: Icon
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
      <div className="flex items-center justify-between">
        <span className="text-gray-500 font-medium text-sm">
          {title}
        </span>
        {Icon && (
          <div className="p-3 bg-gray-50 group-hover:bg-black group-hover:text-white rounded-2xl text-gray-500 transition-all duration-300">
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="mt-4">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          {value}
        </h2>

        <div className="flex items-center gap-1.5 mt-2">
          {positive ? (
            <FiTrendingUp className="text-emerald-500" size={16} />
          ) : (
            <FiTrendingDown className="text-rose-500" size={16} />
          )}
          <span
            className={`text-sm font-semibold ${
              positive
                ? "text-emerald-600"
                : "text-rose-600"
            }`}
          >
            {change}
          </span>
          <span className="text-xs text-gray-400">vs last month</span>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;