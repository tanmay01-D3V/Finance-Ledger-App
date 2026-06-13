import { Outlet } from "react-router-dom";

import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-[#F7F7F7]">

      <Sidebar />

      <div className="flex flex-col flex-1">

        <Header />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default MainLayout;