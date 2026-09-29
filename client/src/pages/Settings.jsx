import { useEffect, useState } from "react";

import {
  User,
  Mail,
  ShieldCheck,
  Palette,
  Sun,
  Moon,
  Check,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  const isLight = theme === "light";

  const [currentUser, setCurrentUser] = useState({
    name: "User",
    email: "",
  });

  // =========================================================
  // LOAD CURRENT USER
  // =========================================================

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

  const userInitial =
    currentUser.name?.trim()?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <div className="w-full space-y-7 px-6 py-6 lg:px-8">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div>
        <p className="mb-2 text-sm font-medium text-indigo-400">
          System
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Settings
        </h1>

        <p className="mt-2 text-sm text-slate-400 sm:text-base">
          Manage your account and application preferences.
        </p>
      </div>

      {/* =====================================================
          ACCOUNT
      ====================================================== */}

      <section className="overflow-hidden rounded-2xl border border-indigo-500/15 bg-[#0c1029]/80 shadow-lg shadow-black/10 backdrop-blur-xl">
        {/* Section Header */}
        <div className="border-b border-slate-800/80 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
              <User
                size={20}
                className="text-indigo-400"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Account Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Information about the currently logged-in
                account.
              </p>
            </div>
          </div>
        </div>

        {/* Account Content */}
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl font-bold text-white shadow-lg shadow-indigo-500/20">
              {userInitial}
            </div>

            {/* Information */}
            <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Name */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <User
                    size={15}
                    className="text-slate-500"
                  />

                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Name
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-3">
                  <p className="text-sm font-medium text-white">
                    {currentUser.name}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Mail
                    size={15}
                    className="text-slate-500"
                  />

                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Email
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-3">
                  <p className="truncate text-sm font-medium text-white">
                    {currentUser.email || "Not available"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-4 py-3">
            <ShieldCheck
              size={19}
              className="shrink-0 text-emerald-400"
            />

            <div>
              <p className="text-sm font-medium text-emerald-300">
                Account verified
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Your account is authenticated and active.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          APPEARANCE
      ====================================================== */}

      <section className="overflow-hidden rounded-2xl border border-indigo-500/15 bg-[#0c1029]/80 shadow-lg shadow-black/10 backdrop-blur-xl">
        {/* Section Header */}
        <div className="border-b border-slate-800/80 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
              <Palette
                size={20}
                className="text-violet-400"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Appearance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Customize how StudentHub looks on your
                device.
              </p>
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                Theme
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Choose between light and dark appearance.
              </p>
            </div>

            {/* Theme Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {/* Light */}
              <button
                type="button"
                onClick={() => {
                  if (!isLight) {
                    toggleTheme();
                  }
                }}
                className={`relative flex min-w-[130px] items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  isLight
                    ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300 ring-1 ring-indigo-500/20"
                    : "border-slate-800 bg-slate-950/30 text-slate-400 hover:border-slate-700 hover:text-white"
                }`}
              >
                <Sun size={17} />

                <span>Light</span>

                {isLight && (
                  <Check
                    size={15}
                    className="absolute right-2 top-2 text-indigo-400"
                  />
                )}
              </button>

              {/* Dark */}
              <button
                type="button"
                onClick={() => {
                  if (isLight) {
                    toggleTheme();
                  }
                }}
                className={`relative flex min-w-[130px] items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  !isLight
                    ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300 ring-1 ring-indigo-500/20"
                    : "border-slate-800 bg-slate-950/30 text-slate-400 hover:border-slate-700 hover:text-white"
                }`}
              >
                <Moon size={17} />

                <span>Dark</span>

                {!isLight && (
                  <Check
                    size={15}
                    className="absolute right-2 top-2 text-indigo-400"
                  />
                )}
              </button>
            </div>
          </div>

          {/* Current Theme */}
          <div className="mt-6 rounded-xl border border-indigo-500/10 bg-indigo-500/5 px-4 py-3">
            <p className="text-xs text-slate-500">
              Current theme
            </p>

            <p className="mt-1 text-sm font-medium text-indigo-300">
              {isLight ? "Light Mode" : "Dark Mode"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;