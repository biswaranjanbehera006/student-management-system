import { useEffect, useRef, useState } from "react";

import {
  Bell,
  ChevronDown,
  Menu,
  Search,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  Users,
  BookOpen,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

const TopNavbar = ({ setMobileOpen }) => {
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();

  const isLight = theme === "light";

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [students, setStudents] = useState([]);

  const [searchOpen, setSearchOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState({
    name: "User",
    email: "",
  });

  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

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

  // =========================================================
  // LOAD STUDENTS FOR GLOBAL SEARCH
  // =========================================================

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get("/students");

        setStudents(response.data.data || []);
      } catch (error) {
        console.error(
          "Global search student loading error:",
          error
        );
      }
    };

    fetchStudents();
  }, []);

  // =========================================================
  // CLOSE USER MENU
  // =========================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =========================================================
  // GLOBAL SEARCH RESULTS
  // =========================================================

  const searchTerm = search.trim().toLowerCase();

  const searchResults = searchTerm
    ? students
        .filter((student) => {
          const name =
            student.name?.toLowerCase() || "";

          const email =
            student.email?.toLowerCase() || "";

          const course =
            student.course?.toLowerCase() || "";

          const phone =
            student.phone?.toLowerCase() || "";

          return (
            name.includes(searchTerm) ||
            email.includes(searchTerm) ||
            course.includes(searchTerm) ||
            phone.includes(searchTerm)
          );
        })
        .slice(0, 6)
    : [];

  // =========================================================
  // SEARCH SUBMIT
  // =========================================================

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const value = search.trim();

    if (!value) {
      return;
    }

    setSearchOpen(false);

    navigate(
      `/students?search=${encodeURIComponent(value)}`
    );
  };

  // =========================================================
  // CLICK SEARCH RESULT
  // =========================================================

  const handleSearchResult = () => {
    const value = search.trim();

    setSearchOpen(false);

    navigate(
      `/students?search=${encodeURIComponent(value)}`
    );
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUserMenuOpen(false);

    toast.success("Logged out successfully");

    navigate("/login");
  };

  // =========================================================
  // SETTINGS
  // =========================================================

  const handleSettings = () => {
    setUserMenuOpen(false);

    navigate("/settings");
  };

  // =========================================================
  // PROFILE
  // =========================================================

  const handleProfile = () => {
    setUserMenuOpen(false);

    navigate("/settings");
  };

  // =========================================================
  // USER INITIAL
  // =========================================================

  const userInitial =
    currentUser.name?.trim()?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <header
      className={`sticky top-0 z-30 border-b backdrop-blur-xl ${
        isLight
          ? "border-slate-200 bg-white/90"
          : "border-white/10 bg-[#070A1B]/85"
      }`}
    >
      <div className="flex h-[76px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className={`rounded-xl border p-2.5 transition lg:hidden ${
            isLight
              ? "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              : "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white"
          }`}
        >
          <Menu size={20} />
        </button>

        {/* =================================================
            GLOBAL SEARCH
        ================================================== */}

        <div
          ref={searchRef}
          className="relative hidden max-w-2xl flex-1 md:block"
        >
          <form onSubmit={handleSearchSubmit}>
            <Search
              size={18}
              className={`absolute left-3.5 top-1/2 z-10 -translate-y-1/2 ${
                isLight
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => {
                if (search.trim()) {
                  setSearchOpen(true);
                }
              }}
              placeholder="Search students, courses..."
              className={`h-11 w-full rounded-xl border pl-10 pr-4 text-sm outline-none transition ${
                isLight
                  ? "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  : "border-white/10 bg-white/[0.035] text-white placeholder:text-slate-600 hover:border-white/15 focus:border-indigo-400/40 focus:bg-white/[0.055] focus:ring-4 focus:ring-indigo-500/10"
              }`}
            />
          </form>

          {/* Search Results */}
          {searchOpen && search.trim() && (
            <div
              className={`absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border shadow-2xl ${
                isLight
                  ? "border-slate-200 bg-white shadow-slate-200/60"
                  : "border-slate-800 bg-[#0c1029] shadow-black/50"
              }`}
            >
              {searchResults.length > 0 ? (
                <>
                  <div className="px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Students
                    </p>
                  </div>

                  <div className="border-t border-slate-800/70">
                    {searchResults.map((student) => (
                      <button
                        key={student._id}
                        type="button"
                        onClick={handleSearchResult}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                          isLight
                            ? "hover:bg-slate-50"
                            : "hover:bg-white/[0.04]"
                        }`}
                      >
                        {/* Avatar */}
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-500/10">
                          {student.profilePhoto?.url ? (
                            <img
                              src={student.profilePhoto.url}
                              alt={`${student.name} profile`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Users
                              size={17}
                              className="text-indigo-400"
                            />
                          )}
                        </div>

                        {/* Student */}
                        <div className="min-w-0 flex-1">
                          <p
                            className={`truncate text-sm font-medium ${
                              isLight
                                ? "text-slate-900"
                                : "text-white"
                            }`}
                          >
                            {student.name}
                          </p>

                          <div className="mt-0.5 flex items-center gap-2">
                            <p className="truncate text-xs text-slate-500">
                              {student.email}
                            </p>

                            <span className="shrink-0 text-slate-700">
                              •
                            </span>

                            <p className="shrink-0 text-xs text-indigo-400">
                              {student.course}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleSearchSubmit}
                    className={`flex w-full items-center justify-center gap-2 border-t px-4 py-3 text-sm font-medium text-indigo-400 transition ${
                      isLight
                        ? "border-slate-200 hover:bg-indigo-50"
                        : "border-slate-800 hover:bg-indigo-500/5"
                    }`}
                  >
                    <Search size={15} />

                    View all search results
                  </button>
                </>
              ) : (
                <div className="px-5 py-6 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                    <BookOpen
                      size={19}
                      className="text-indigo-400"
                    />
                  </div>

                  <p
                    className={`mt-3 text-sm font-medium ${
                      isLight
                        ? "text-slate-900"
                        : "text-white"
                    }`}
                  >
                    No results found
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Press Enter to search the Students page.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="ml-auto flex items-center gap-2">
          {/* Mobile Search */}
          <button
            type="button"
            onClick={() => {
              toast("Search is available on the desktop header.", {
                icon: "🔎",
              });
            }}
            className={`rounded-xl border p-2.5 transition md:hidden ${
              isLight
                ? "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                : "border-white/10 bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white"
            }`}
          >
            <Search size={19} />
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            title={
              isLight
                ? "Switch to dark mode"
                : "Switch to light mode"
            }
            className={`rounded-xl border p-2.5 transition ${
              isLight
                ? "border-slate-200 bg-slate-50 text-amber-500 hover:bg-amber-50"
                : "border-white/10 bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-indigo-300"
            }`}
          >
            {isLight ? (
              <Moon size={19} />
            ) : (
              <Sun size={19} />
            )}
          </button>

          {/* Notifications */}
          <button
            type="button"
            className={`relative rounded-xl border p-2.5 transition ${
              isLight
                ? "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                : "border-white/10 bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white"
            }`}
          >
            <Bell size={19} />

            <span
              className={`absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-indigo-400 ring-2 ${
                isLight
                  ? "ring-white"
                  : "ring-[#070A1B]"
              }`}
            />
          </button>

          {/* Divider */}
          <div
            className={`mx-1 hidden h-8 w-px sm:block ${
              isLight
                ? "bg-slate-200"
                : "bg-white/10"
            }`}
          />

          {/* User */}
          <div
            ref={userMenuRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setUserMenuOpen(
                  (previous) => !previous
                )
              }
              className={`flex items-center gap-2 rounded-xl px-2 py-1.5 transition ${
                isLight
                  ? "hover:bg-slate-100"
                  : "hover:bg-white/[0.05]"
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
                {userInitial}
              </div>

              <div className="hidden max-w-[145px] text-left sm:block">
                <p
                  className={`truncate text-sm font-medium ${
                    isLight
                      ? "text-slate-900"
                      : "text-white"
                  }`}
                >
                  {currentUser.name}
                </p>

                <p className="text-[10px] text-slate-500">
                  Administrator
                </p>
              </div>

              <ChevronDown
                size={16}
                className={`hidden transition-transform sm:block ${
                  userMenuOpen ? "rotate-180" : ""
                } ${
                  isLight
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              />
            </button>

            {/* User Dropdown */}
            {userMenuOpen && (
              <div
                className={`absolute right-0 top-[calc(100%+10px)] z-50 w-72 overflow-hidden rounded-2xl border shadow-2xl ${
                  isLight
                    ? "border-slate-200 bg-white shadow-slate-200/60"
                    : "border-slate-800 bg-[#0c1029] shadow-black/40"
                }`}
              >
                <div
                  className={`border-b px-4 py-4 ${
                    isLight
                      ? "border-slate-200 bg-slate-50"
                      : "border-slate-800 bg-slate-950/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
                      {userInitial}
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`truncate text-sm font-semibold ${
                          isLight
                            ? "text-slate-900"
                            : "text-white"
                        }`}
                      >
                        {currentUser.name}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {currentUser.email ||
                          "Administrator"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    type="button"
                    onClick={handleProfile}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      isLight
                        ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <User size={17} />

                    <span>Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSettings}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      isLight
                        ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <Settings size={17} />

                    <span>Settings</span>
                  </button>

                  <div
                    className={`my-2 h-px ${
                      isLight
                        ? "bg-slate-200"
                        : "bg-slate-800"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      isLight
                        ? "text-red-500 hover:bg-red-50"
                        : "text-red-400 hover:bg-red-500/10"
                    }`}
                  >
                    <LogOut size={17} />

                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;