import { useState } from "react";

import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

import {
  ThemeProvider,
  useTheme,
} from "../context/ThemeContext";

import "../styles/theme.css";

const DashboardContent = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { theme } = useTheme();

  const isLight = theme === "light";

  return (
    <div
      className={
        isLight
          ? "light-theme min-h-screen bg-slate-50 text-slate-900"
          : "min-h-screen bg-[#07091c] text-white"
      }
    >
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Application */}
      <div className="min-h-screen lg:ml-[270px]">
        <TopNavbar setMobileOpen={setMobileOpen} />

        {/* Page Content */}
        <main
          className={
            isLight
              ? "min-h-[calc(100vh-76px)] bg-slate-50"
              : "min-h-[calc(100vh-76px)] bg-gradient-to-br from-[#07091c] via-[#080b21] to-[#100827]"
          }
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  return (
    <ThemeProvider>
      <DashboardContent />
    </ThemeProvider>
  );
};

export default DashboardLayout;