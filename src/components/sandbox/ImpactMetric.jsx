const ImpactMetric = ({
  title,
  value,
  unit = "",
  subtitle,
  color = "text-black",
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 min-h-[220px]">
      <h3 className="text-gray-600 text-lg font-semibold mb-6">
        {title}
      </h3>

      <div className="flex items-end gap-2">
        <span className={`text-6xl font-bold ${color}`}>
          {value}
        </span>

        {unit && (
          <span className={`text-3xl font-semibold mb-2 ${color}`}>
            {unit}
          </span>
        )}
      </div>

      <p className={`mt-6 font-medium ${color}`}>
        {subtitle}
      </p>
    </div>
  );
};

export default ImpactMetric;