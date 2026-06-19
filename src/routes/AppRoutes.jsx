import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard";
import Ledger from "../pages/Ledger";
import Forecast from "../pages/Forecast";
import Sandbox from "../pages/Sandbox";
import Settings from "../pages/Settings";
import Loans from "../pages/Loans";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/ledger"
            element={<Ledger />}
          />

          <Route
            path="/forecast"
            element={<Forecast />}
          />

          <Route
            path="/sandbox"
            element={<Sandbox />}
          />

          <Route
            path="/loans"
            element={<Loans />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;