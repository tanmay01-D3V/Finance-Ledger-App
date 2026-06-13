import { FiBell } from "react-icons/fi";

const NotificationButton = () => {
  return (
    <button
      className="
        p-2
        rounded-lg
        hover:bg-gray-100
      "
    >
      <FiBell size={22} />
    </button>
  );
};

export default NotificationButton;