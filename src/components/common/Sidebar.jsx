import {
  FiGrid,
  FiBook,
  FiTrendingUp,
  FiTool,
  FiSettings,
  FiCreditCard,
  FiHelpCircle,
  FiLogOut
} from "react-icons/fi";

import SidebarItem from "./SidebarItem";

const Sidebar = ({ isCollapsed = false }) => {
  const sidebarWidth = isCollapsed ? "w-20" : "w-64";
  const logoText = isCollapsed ? null : (
    <>
      <h1 className="text-3xl font-bold leading-tight">
        CashFlow
        <br />
        Runway
      </h1>
      <p className="text-gray-500 text-sm">Institutional Grade</p>
    </>
  );

  return (
    <aside
      className={`${sidebarWidth} h-screen bg-white border-r flex flex-col transition-all duration-300 ease-in-out overflow-hidden`}
    >
      {/* Logo */}
      <div className="p-6 border-b flex flex-col items-center">
        {logoText}
        {isCollapsed && <span className="text-2xl font-bold">CR</span>}
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 space-y-2 overflow-y-auto">
        <SidebarItem
          icon={<FiGrid />}
          title="Dashboard"
          path="/"
          isCollapsed={isCollapsed}
        />

        <SidebarItem
          icon={<FiBook />}
          title="Ledger"
          path="/ledger"
          isCollapsed={isCollapsed}
        />

        <SidebarItem
          icon={<FiTrendingUp />}
          title="Forecast"
          path="/forecast"
          isCollapsed={isCollapsed}
        />

        <SidebarItem
          icon={<FiTool />}
          title="Sandbox"
          path="/sandbox"
          isCollapsed={isCollapsed}
        />

        <SidebarItem
          icon={<FiCreditCard />}
          title="Loans"
          path="/loans"
          isCollapsed={isCollapsed}
        />

        <SidebarItem
          icon={<FiSettings />}
          title="Settings"
          path="/settings"
          isCollapsed={isCollapsed}
        />
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t space-y-2">
        <button
          className={`flex items-center gap-3 py-2 w-full mx-auto ${isCollapsed ? "justify-center" : ""}`}
          title="Help"
        >
          <FiHelpCircle />
          {!isCollapsed && <span>Help</span>}
        </button>

        <button
          className={`flex items-center gap-3 py-2 w-full mx-auto ${isCollapsed ? "justify-center" : ""}`}
          title="Sign Out"
        >
          <FiLogOut />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;