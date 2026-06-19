const PrimaryButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        px-5
        py-3
        bg-black
        text-white
        rounded-xl
        font-medium
        hover:opacity-90
      "
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
