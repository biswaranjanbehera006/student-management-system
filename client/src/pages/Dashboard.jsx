import { useEffect, useMemo, useState } from "react";

import {
  Users,
  BookOpen,
  UserPlus,
  ArrowUpRight,
  Loader2,
  BarChart3,
  PieChart,
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { useTheme } from "../context/ThemeContext";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();

  const { theme } = useTheme();

  const isLight = theme === "light";

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // FETCH DASHBOARD DATA
  // =========================================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const response = await api.get("/students");

      setStudents(response.data.data || []);
    } catch (error) {
      console.error("Dashboard data error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // =========================================================
  // DASHBOARD STATISTICS
  // =========================================================

  const totalStudents = students.length;

  const uniqueCourses = [
    ...new Set(
      students
        .map((student) => student.course?.trim())
        .filter(Boolean)
    ),
  ];

  const totalCourses = uniqueCourses.length;

  // =========================================================
  // RECENTLY ADDED STUDENTS
  // =========================================================

  const recentlyAddedStudents = [...students]
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )
    .slice(0, 5);

  // =========================================================
  // COURSE DATA FOR CHARTS
  // =========================================================

  const courseData = useMemo(() => {
    const courseCounts = {};

    students.forEach((student) => {
      const course = student.course?.trim();

      if (course) {
        courseCounts[course] =
          (courseCounts[course] || 0) + 1;
      }
    });

    return Object.entries(courseCounts).sort(
      (a, b) => b[1] - a[1]
    );
  }, [students]);

  // =========================================================
  // BAR CHART DATA
  // =========================================================

  const barChartData = {
    labels: courseData.map(([course]) => course),

    datasets: [
      {
        label: "Students",
        data: courseData.map(([, count]) => count),

        backgroundColor: isLight
          ? "rgba(99, 102, 241, 0.75)"
          : "rgba(129, 140, 248, 0.75)",

        borderColor: isLight
          ? "rgb(79, 70, 229)"
          : "rgb(129, 140, 248)",

        borderWidth: 1,

        borderRadius: 8,

        maxBarThickness: 55,
      },
    ],
  };

  // =========================================================
  // PIE CHART DATA
  // =========================================================

  const pieChartData = {
    labels: courseData.map(([course]) => course),

    datasets: [
      {
        label: "Students",

        data: courseData.map(([, count]) => count),

        backgroundColor: [
          "rgba(99, 102, 241, 0.85)",
          "rgba(139, 92, 246, 0.85)",
          "rgba(14, 165, 233, 0.85)",
          "rgba(20, 184, 166, 0.85)",
          "rgba(245, 158, 11, 0.85)",
          "rgba(236, 72, 153, 0.85)",
        ],

        borderColor: isLight
          ? "#ffffff"
          : "#0c1029",

        borderWidth: 3,
      },
    ],
  };

  // =========================================================
  // BAR CHART OPTIONS
  // =========================================================

  const barChartOptions = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        backgroundColor: isLight
          ? "#ffffff"
          : "#11162f",

        titleColor: isLight
          ? "#0f172a"
          : "#ffffff",

        bodyColor: isLight
          ? "#475569"
          : "#cbd5e1",

        borderColor: isLight
          ? "#e2e8f0"
          : "rgba(129, 140, 248, 0.2)",

        borderWidth: 1,

        padding: 12,

        displayColors: false,
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: isLight
            ? "#64748b"
            : "#94a3b8",

          font: {
            size: 12,
          },
        },
      },

      y: {
        beginAtZero: true,

        ticks: {
          precision: 0,

          color: isLight
            ? "#64748b"
            : "#94a3b8",

          font: {
            size: 12,
          },
        },

        grid: {
          color: isLight
            ? "rgba(148, 163, 184, 0.18)"
            : "rgba(148, 163, 184, 0.08)",
        },
      },
    },
  };

  // =========================================================
  // PIE CHART OPTIONS
  // =========================================================

  const pieChartOptions = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          color: isLight
            ? "#475569"
            : "#cbd5e1",

          padding: 18,

          usePointStyle: true,

          pointStyle: "circle",

          font: {
            size: 12,
          },
        },
      },

      tooltip: {
        backgroundColor: isLight
          ? "#ffffff"
          : "#11162f",

        titleColor: isLight
          ? "#0f172a"
          : "#ffffff",

        bodyColor: isLight
          ? "#475569"
          : "#cbd5e1",

        borderColor: isLight
          ? "#e2e8f0"
          : "rgba(129, 140, 248, 0.2)",

        borderWidth: 1,

        padding: 12,
      },
    },
  };

  // =========================================================
  // STATISTICS CARDS
  // =========================================================

  const stats = [
    {
      title: "Total Students",
      value: totalStudents,
      description: "Registered students",
      icon: Users,
    },

    {
      title: "Total Courses",
      value: totalCourses,
      description: "Available courses",
      icon: BookOpen,
    },

    {
      title: "Recently Added",
      value: recentlyAddedStudents.length,
      description: "New students",
      icon: UserPlus,
    },
  ];

  return (
    <div className="w-full space-y-7 px-6 py-6 lg:px-8">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-indigo-400">
            Overview
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Welcome back. Here's what's happening with your
            student management system.
          </p>
        </div>

        <button
          onClick={() => navigate("/students")}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-2.5 text-sm font-semibold text-indigo-300 transition hover:border-indigo-500/40 hover:bg-indigo-500/20"
        >
          View Students

          <ArrowUpRight size={17} />
        </button>
      </div>

      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="group rounded-2xl border border-indigo-500/15 bg-[#0c1029]/80 p-5 shadow-lg shadow-black/10 backdrop-blur-xl transition hover:border-indigo-500/30 hover:bg-[#0f1433]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    {stat.title}
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    {loading ? (
                      <Loader2
                        size={28}
                        className="animate-spin text-indigo-400"
                      />
                    ) : (
                      <h2 className="text-3xl font-bold text-white">
                        {stat.value}
                      </h2>
                    )}
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    {stat.description}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 ring-1 ring-indigo-500/20">
                  <Icon
                    size={23}
                    className="text-indigo-400"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =====================================================
          CHARTS
      ====================================================== */}

      {!loading && students.length > 0 && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {/* Students by Course */}
          <div className="rounded-2xl border border-indigo-500/15 bg-[#0c1029]/80 p-5 shadow-lg shadow-black/10 backdrop-blur-xl sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10">
                <BarChart3
                  size={20}
                  className="text-indigo-400"
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Students by Course
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Number of registered students in each
                  course.
                </p>
              </div>
            </div>

            <div className="mt-6 h-[300px]">
              {courseData.length > 0 ? (
                <Bar
                  data={barChartData}
                  options={barChartOptions}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  No course data available.
                </div>
              )}
            </div>
          </div>

          {/* Course Distribution */}
          <div className="rounded-2xl border border-indigo-500/15 bg-[#0c1029]/80 p-5 shadow-lg shadow-black/10 backdrop-blur-xl sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                <PieChart
                  size={20}
                  className="text-violet-400"
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Course Distribution
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Student distribution across courses.
                </p>
              </div>
            </div>

            <div className="mt-6 h-[300px]">
              {courseData.length > 0 ? (
                <Pie
                  data={pieChartData}
                  options={pieChartOptions}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  No course data available.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          RECENTLY ADDED STUDENTS
      ====================================================== */}

      <div className="overflow-hidden rounded-2xl border border-indigo-500/15 bg-[#0c1029]/80 shadow-lg shadow-black/10 backdrop-blur-xl">
        {/* Section Header */}
        <div className="flex flex-col gap-3 border-b border-slate-800/80 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Recently Added Students
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest students added to the system.
            </p>
          </div>

          <button
            onClick={() => navigate("/students")}
            className="text-left text-sm font-medium text-indigo-400 transition hover:text-indigo-300 sm:text-right"
          >
            View all
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Loader2
                size={20}
                className="animate-spin text-indigo-400"
              />

              Loading students...
            </div>
          </div>
        ) : recentlyAddedStudents.length === 0 ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
              <Users
                size={22}
                className="text-indigo-400"
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-white">
              No students yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Add students to see them here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-950/30">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Student
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Course
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Age
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60">
                {recentlyAddedStudents.map((student) => (
                  <tr
                    key={student._id}
                    className="transition hover:bg-indigo-500/5"
                  >
                    {/* Student */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">
                          {student.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          ID: {student._id.slice(-8)}
                        </p>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {student.email}
                    </td>

                    {/* Course */}
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300 ring-1 ring-indigo-500/10">
                        {student.course}
                      </span>
                    </td>

                    {/* Age */}
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {student.age}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;