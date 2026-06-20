import { Outlet } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useLocalStorage } from "../hooks/useLocalStorage";

import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";

const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage("sidebar-collapsed", false);

  return (
    <div className="flex h-screen bg-[#F7F7F7]">
      <Sidebar isCollapsed={isSidebarCollapsed} />

      <div className="flex flex-col flex-1">
        <Header onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} isSidebarCollapsed={isSidebarCollapsed} />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className={`fixed bottom-6 ${isSidebarCollapsed ? "left-6" : "left-70"} z-50 p-2 bg-white rounded-full shadow-lg border hover:bg-gray-50 transition-all`}
        aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isSidebarCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
      </button>
    </div>
  );
};

export default MainLayout;