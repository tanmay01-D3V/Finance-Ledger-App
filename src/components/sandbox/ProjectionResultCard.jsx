const ProjectionResultCard = ({
  label,
  value,
  danger = false,
}) => {
  return (
    <div className="pr-8">
      <p className="uppercase text-gray-600 font-semibold text-sm">
        {label}
      </p>

      <h3
        className={`text-5xl font-bold mt-2 ${
          danger ? "text-red-600" : "text-black"
        }`}
      >
        {value}
      </h3>
    </div>
  );
};

export default ProjectionResultCard;