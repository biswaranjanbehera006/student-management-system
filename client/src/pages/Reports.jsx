import { useEffect, useMemo, useState } from "react";

import {
  BarChart3,
  BookOpen,
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  Users,
  CalendarDays,
  Search,
} from "lucide-react";

import toast from "react-hot-toast";

import * as XLSX from "xlsx";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import api from "../services/api";

const Reports = () => {
  const [students, setStudents] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [exporting, setExporting] = useState("");

  // =========================================================
  // FETCH STUDENTS
  // =========================================================

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response = await api.get("/students");

      setStudents(response.data.data || []);
    } catch (error) {
      console.error("Reports data error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load report data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // =========================================================
  // COURSE SUMMARY
  // =========================================================

  const courseSummary = useMemo(() => {
    const courseMap = {};

    students.forEach((student) => {
      const course = student.course?.trim();

      if (!course) {
        return;
      }

      if (!courseMap[course]) {
        courseMap[course] = 0;
      }

      courseMap[course] += 1;
    });

    return Object.entries(courseMap)
      .map(([course, count]) => ({
        course,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [students]);

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalStudents = students.length;

  const totalCourses = courseSummary.length;

  const averageAge =
    totalStudents > 0
      ? (
          students.reduce(
            (total, student) =>
              total + Number(student.age || 0),
            0
          ) / totalStudents
        ).toFixed(1)
      : "0.0";

  const latestStudent =
    students.length > 0
      ? [...students].sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )[0]
      : null;

  // =========================================================
  // FILTER STUDENTS
  // =========================================================

  const filteredStudents = students.filter(
    (student) => {
      const value = search
        .trim()
        .toLowerCase();

      if (!value) {
        return true;
      }

      return (
        student.name
          ?.toLowerCase()
          .includes(value) ||
        student.email
          ?.toLowerCase()
          .includes(value) ||
        student.course
          ?.toLowerCase()
          .includes(value) ||
        student.phone
          ?.toLowerCase()
          .includes(value)
      );
    }
  );

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================================
  // EXPORT EXCEL
  // =========================================================

  const exportToExcel = () => {
    try {
      setExporting("excel");

      const exportData = students.map(
        (student, index) => ({
          "S.No": index + 1,
          "Student ID": student._id,
          Name: student.name,
          Email: student.email,
          Age: student.age,
          Course: student.course,
          Phone: student.phone,
          Address: student.address,
          "Created At": formatDate(
            student.createdAt
          ),
        })
      );

      const worksheet =
        XLSX.utils.json_to_sheet(exportData);

      // Column widths
      worksheet["!cols"] = [
        { wch: 8 },
        { wch: 26 },
        { wch: 24 },
        { wch: 32 },
        { wch: 8 },
        { wch: 18 },
        { wch: 18 },
        { wch: 35 },
        { wch: 18 },
      ];

      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Students"
      );

      // Summary worksheet
      const summaryData = [
        ["Student Management System"],
        ["Student Report"],
        [],
        ["Total Students", totalStudents],
        ["Total Courses", totalCourses],
        ["Average Age", averageAge],
        [],
        ["Course", "Students"],
        ...courseSummary.map((item) => [
          item.course,
          item.count,
        ]),
      ];

      const summaryWorksheet =
        XLSX.utils.aoa_to_sheet(summaryData);

      summaryWorksheet["!cols"] = [
        { wch: 28 },
        { wch: 18 },
      ];

      XLSX.utils.book_append_sheet(
        workbook,
        summaryWorksheet,
        "Summary"
      );

      XLSX.writeFile(
        workbook,
        `student-report-${new Date()
          .toISOString()
          .slice(0, 10)}.xlsx`
      );

      toast.success(
        "Excel report downloaded successfully"
      );
    } catch (error) {
      console.error(
        "Excel export error:",
        error
      );

      toast.error(
        "Unable to export Excel report"
      );
    } finally {
      setExporting("");
    }
  };

  // =========================================================
  // EXPORT PDF
  // =========================================================

  const exportToPDF = () => {
    try {
      setExporting("pdf");

      const doc = new jsPDF();

      // Title
      doc.setFontSize(20);

      doc.setTextColor(40, 40, 80);

      doc.text(
        "Student Management System",
        14,
        18
      );

      // Subtitle
      doc.setFontSize(11);

      doc.setTextColor(100, 100, 100);

      doc.text(
        "Student Report",
        14,
        26
      );

      doc.text(
        `Generated: ${formatDate(
          new Date()
        )}`,
        14,
        33
      );

      // Summary
      doc.setFontSize(12);

      doc.setTextColor(40, 40, 40);

      doc.text(
        `Total Students: ${totalStudents}`,
        14,
        45
      );

      doc.text(
        `Total Courses: ${totalCourses}`,
        14,
        52
      );

      doc.text(
        `Average Age: ${averageAge}`,
        14,
        59
      );

      // Course summary
      autoTable(doc, {
        startY: 68,

        head: [
          ["Course", "Students"],
        ],

        body: courseSummary.map(
          (item) => [
            item.course,
            item.count,
          ]
        ),

        theme: "grid",

        styles: {
          fontSize: 9,
          cellPadding: 3,
        },

        headStyles: {
          fillColor: [79, 70, 229],
          textColor: 255,
        },
      });

      // Student table
      const finalY =
        doc.lastAutoTable?.finalY || 80;

      autoTable(doc, {
        startY: finalY + 12,

        head: [
          [
            "S.No",
            "Name",
            "Email",
            "Age",
            "Course",
            "Phone",
          ],
        ],

        body: students.map(
          (student, index) => [
            index + 1,
            student.name || "N/A",
            student.email || "N/A",
            student.age || "N/A",
            student.course || "N/A",
            student.phone || "N/A",
          ]
        ),

        theme: "grid",

        styles: {
          fontSize: 7.5,
          cellPadding: 2.5,
        },

        headStyles: {
          fillColor: [79, 70, 229],
          textColor: 255,
        },

        columnStyles: {
          0: {
            cellWidth: 12,
          },

          1: {
            cellWidth: 28,
          },

          2: {
            cellWidth: 40,
          },

          3: {
            cellWidth: 12,
          },

          4: {
            cellWidth: 24,
          },

          5: {
            cellWidth: 28,
          },
        },
      });

      doc.save(
        `student-report-${new Date()
          .toISOString()
          .slice(0, 10)}.pdf`
      );

      toast.success(
        "PDF report downloaded successfully"
      );
    } catch (error) {
      console.error(
        "PDF export error:",
        error
      );

      toast.error(
        "Unable to export PDF report"
      );
    } finally {
      setExporting("");
    }
  };

  // =========================================================
  // REPORT STAT CARDS
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
      title: "Average Age",
      value: averageAge,
      description: "Across all students",
      icon: BarChart3,
    },

    {
      title: "Latest Student",
      value: latestStudent?.name || "N/A",
      description: latestStudent
        ? formatDate(latestStudent.createdAt)
        : "No students",
      icon: CalendarDays,
    },
  ];

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div className="w-full space-y-7 px-6 py-6 lg:px-8">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div>
        <p className="mb-2 text-sm font-medium text-indigo-400">
          Analytics
        </p>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Reports
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
              Generate and export student management
              reports in Excel and PDF formats.
            </p>
          </div>

          {/* Export Buttons */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={exportToExcel}
              disabled={
                loading ||
                exporting !== ""
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-300 transition hover:border-emerald-500/40 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {exporting === "excel" ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <FileSpreadsheet size={18} />
              )}

              {exporting === "excel"
                ? "Exporting..."
                : "Export Excel"}
            </button>

            <button
              type="button"
              onClick={exportToPDF}
              disabled={
                loading ||
                exporting !== ""
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 transition hover:border-red-500/40 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {exporting === "pdf" ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <FileText size={18} />
              )}

              {exporting === "pdf"
                ? "Generating..."
                : "Export PDF"}
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-indigo-500/15 bg-[#0c1029]/80 p-5 shadow-lg shadow-black/10 backdrop-blur-xl transition hover:border-indigo-500/30 hover:bg-[#0f1433]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-400">
                    {stat.title}
                  </p>

                  <div className="mt-3">
                    {loading ? (
                      <Loader2
                        size={27}
                        className="animate-spin text-indigo-400"
                      />
                    ) : (
                      <h2 className="truncate text-2xl font-bold text-white">
                        {stat.value}
                      </h2>
                    )}
                  </div>

                  <p className="mt-2 truncate text-xs text-slate-500">
                    {stat.description}
                  </p>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 ring-1 ring-indigo-500/20">
                  <Icon
                    size={21}
                    className="text-indigo-400"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =====================================================
          COURSE SUMMARY
      ====================================================== */}

      <div className="rounded-2xl border border-indigo-500/15 bg-[#0c1029]/80 shadow-lg shadow-black/10 backdrop-blur-xl">
        <div className="border-b border-slate-800/80 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
              <BarChart3
                size={20}
                className="text-indigo-400"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Course Summary
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Student distribution across courses.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[180px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Loader2
                size={20}
                className="animate-spin text-indigo-400"
              />

              Loading report data...
            </div>
          </div>
        ) : courseSummary.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            No course data available.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-950/30">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Course
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Students
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Distribution
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60">
                {courseSummary.map(
                  (item) => {
                    const percentage =
                      totalStudents > 0
                        ? Math.round(
                            (item.count /
                              totalStudents) *
                              100
                          )
                        : 0;

                    return (
                      <tr
                        key={item.course}
                        className="transition hover:bg-indigo-500/5"
                      >
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300 ring-1 ring-indigo-500/10">
                            {item.course}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-300">
                          {item.count}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex min-w-[220px] items-center gap-3">
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>

                            <span className="w-10 text-right text-xs font-medium text-slate-400">
                              {percentage}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =====================================================
          STUDENT REPORT
      ====================================================== */}

      <div className="overflow-hidden rounded-2xl border border-indigo-500/15 bg-[#0c1029]/80 shadow-lg shadow-black/10 backdrop-blur-xl">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-slate-800/80 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Student Report
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Preview of student data included in exports.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              placeholder="Search report..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex min-h-[250px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Loader2
                size={20}
                className="animate-spin text-indigo-400"
              />

              Loading students...
            </div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="flex min-h-[220px] items-center justify-center px-6 text-center">
            <div>
              <Users
                size={28}
                className="mx-auto text-slate-600"
              />

              <p className="mt-3 text-sm font-medium text-slate-400">
                No students found
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Try changing your search.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-950/30">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    #
                  </th>

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

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Phone
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Added
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60">
                {filteredStudents.map(
                  (student, index) => (
                    <tr
                      key={student._id}
                      className="transition hover:bg-indigo-500/5"
                    >
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium text-white">
                          {student.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          ID:{" "}
                          {student._id.slice(
                            -8
                          )}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-300">
                        {student.email}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300">
                          {student.course}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-300">
                        {student.age}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-300">
                        {student.phone}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-400">
                        {formatDate(
                          student.createdAt
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Result Count */}
        {!loading &&
          filteredStudents.length > 0 && (
            <div className="border-t border-slate-800/80 px-6 py-4">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-medium text-slate-300">
                  {filteredStudents.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-300">
                  {students.length}
                </span>{" "}
                students
              </p>
            </div>
          )}
      </div>

      {/* =====================================================
          EXPORT INFORMATION
      ====================================================== */}

      <div className="rounded-2xl border border-indigo-500/15 bg-[#0c1029]/60 p-5 shadow-lg shadow-black/10 backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10">
            <Download
              size={19}
              className="text-indigo-400"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              Export Reports
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Excel exports include student details and
              a separate course summary sheet. PDF exports
              include the report summary, course
              distribution, and complete student list.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;