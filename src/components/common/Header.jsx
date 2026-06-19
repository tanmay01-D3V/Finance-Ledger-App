import { FiMenu, FiX } from "react-icons/fi";
import SearchBar from "./SearchBar";
import NotificationButton from "./NotificationButton";
import UserProfile from "./UserProfile";
import PrimaryButton from "./PrimaryButton";

const Header = ({ onToggleSidebar, isSidebarCollapsed }) => {
  return (
    <header className="bg-white border-b px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>

          <SearchBar placeholder="Search transactions..." />
        </div>

        <div className="flex items-center gap-4">
          <NotificationButton />

          <PrimaryButton>+ Add Transaction</PrimaryButton>

          <UserProfile />
        </div>
      </div>
    </header>
  );
};

export default Header;