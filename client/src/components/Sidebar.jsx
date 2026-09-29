import { useEffect, useState } from "react";

import {
  BarChart3,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { useTheme } from "../context/ThemeContext";

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();

  const { theme } = useTheme();

  const isLight = theme === "light";

  const [currentUser, setCurrentUser] = useState({
    name: "User",
    email: "",
  });

  // Load logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        setCurrentUser({
          name: parsedUser.name || "User",
          email: parsedUser.email || "",
        });
      } catch (error) {
        console.error("Unable to read user data:", error);
      }
    }
  }, []);

  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Students",
      path: "/students",
      icon: Users,
    },
    {
      name: "Courses",
      path: "/courses",
      icon: BookOpen,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setMobileOpen(false);

    toast.success("Logged out successfully");

    navigate("/login");
  };

  const userInitial =
    currentUser.name?.trim()?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r shadow-2xl backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          isLight
            ? "border-slate-200 bg-white/95 shadow-slate-200/50"
            : "border-white/10 bg-[#0A0E24]/95"
        } ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div
          className={`flex h-[76px] items-center justify-between border-b px-5 ${
            isLight
              ? "border-slate-200"
              : "border-white/10"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
              <GraduationCap size={22} />
            </div>

            <div>
              <h1
                className={`text-[15px] font-bold tracking-wide ${
                  isLight
                    ? "text-slate-900"
                    : "text-white"
                }`}
              >
                StudentHub
              </h1>

              <p className="text-[11px] text-slate-500">
                Management System
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className={`rounded-lg p-2 transition lg:hidden ${
              isLight
                ? "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p
            className={`mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] ${
              isLight
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            Main Menu
          </p>

          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-500/20 to-violet-500/10 text-indigo-600 shadow-sm ring-1 ring-indigo-400/10"
                        : isLight
                        ? "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        : "text-slate-400 hover:bg-white/[0.045] hover:text-white"
                    }`
                  }
                >
                  <Icon
                    size={19}
                    strokeWidth={1.9}
                  />

                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          <p
            className={`mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] ${
              isLight
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            System
          </p>

          <NavLink
            to="/settings"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${
                isActive
                  ? isLight
                    ? "bg-indigo-50 text-indigo-600"
                    : "bg-white/[0.06] text-white"
                  : isLight
                  ? "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  : "text-slate-400 hover:bg-white/[0.045] hover:text-white"
              }`
            }
          >
            <Settings size={19} strokeWidth={1.9} />

            <span>Settings</span>
          </NavLink>
        </div>

        {/* User / Logout */}
        <div
          className={`border-t p-4 ${
            isLight
              ? "border-slate-200"
              : "border-white/10"
          }`}
        >
          <div
            className={`mb-3 flex items-center gap-3 rounded-xl p-3 ${
              isLight
                ? "bg-slate-50"
                : "bg-white/[0.035]"
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
              {userInitial}
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={`truncate text-sm font-medium ${
                  isLight
                    ? "text-slate-900"
                    : "text-white"
                }`}
              >
                {currentUser.name}
              </p>

              <p className="truncate text-[11px] text-slate-500">
                Student Administrator
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
              isLight
                ? "text-slate-500 hover:bg-red-50 hover:text-red-500"
                : "text-slate-400 hover:bg-red-500/10 hover:text-red-300"
            }`}
          >
            <LogOut size={18} />

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;