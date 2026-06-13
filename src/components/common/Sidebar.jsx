import {
  FiGrid,
  FiBook,
  FiTrendingUp,
  FiTool,
  FiSettings,
  FiHelpCircle,
  FiLogOut
} from "react-icons/fi";

import SidebarItem from "./SidebarItem";

const Sidebar = () => {
  return (
    <aside
      className="
        w-64
        h-screen
        bg-white
        border-r
        flex
        flex-col
      "
    >
      {/* Logo */}

      <div className="p-6">
        <h1
          className="
            text-3xl
            font-bold
            leading-tight
          "
        >
          CashFlow
          <br />
          Runway
        </h1>

        <p className="text-gray-500 text-sm">
          Institutional Grade
        </p>
      </div>

      {/* Menu */}

      <nav
        className="
          flex-1
          px-3
          space-y-2
        "
      >
        <SidebarItem
          icon={<FiGrid />}
          title="Dashboard"
          path="/"
        />

        <SidebarItem
          icon={<FiBook />}
          title="Ledger"
          path="/ledger"
        />

        <SidebarItem
          icon={<FiTrendingUp />}
          title="Forecast"
          path="/forecast"
        />

        <SidebarItem
          icon={<FiTool />}
          title="Sandbox"
          path="/sandbox"
        />

        <SidebarItem
          icon={<FiSettings />}
          title="Settings"
          path="/settings"
        />
      </nav>

      {/* Bottom */}

      <div className="p-4 border-t">
        <button
          className="
            flex
            items-center
            gap-3
            py-2
          "
        >
          <FiHelpCircle />
          Help
        </button>

        <button
          className="
            flex
            items-center
            gap-3
            py-2
          "
        >
          <FiLogOut />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;