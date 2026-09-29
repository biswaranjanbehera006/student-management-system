import { useEffect, useState } from "react";

import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Users,
  Loader2,
  Phone,
  MapPin,
  User,
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

const StudentList = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);

  const [deleteStudent, setDeleteStudent] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  // Fetch students
  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response = await api.get("/students");

      setStudents(response.data.data || []);
    } catch (error) {
      console.error("Fetch students error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to fetch students"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Search and sort students
  const filteredStudents = students
    .filter((student) =>
      student.name
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

  // Reset page when search or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortOrder]);

  // Pagination calculations
  const totalPages = Math.ceil(
    filteredStudents.length / studentsPerPage
  );

  const startIndex =
    (currentPage - 1) * studentsPerPage;

  const endIndex =
    startIndex + studentsPerPage;

  const currentStudents = filteredStudents.slice(
    startIndex,
    endIndex
  );

  // Delete student
  const handleDelete = async () => {
    if (!deleteStudent) {
      return;
    }

    try {
      setDeleting(true);

      const response = await api.delete(
        `/students/${deleteStudent._id}`
      );

      setStudents((previous) =>
        previous.filter(
          (student) => student._id !== deleteStudent._id
        )
      );

      toast.success(
        response.data.message ||
          "Student deleted successfully"
      );

      setDeleteStudent(null);

      // Move to previous page if current page becomes empty
      if (
        currentStudents.length === 1 &&
        currentPage > 1
      ) {
        setCurrentPage((previous) => previous - 1);
      }
    } catch (error) {
      console.error("Delete student error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to delete student"
      );
    } finally {
      setDeleting(false);
    }
  };

  // Generate page numbers
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <div className="w-full space-y-7 px-6 py-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-indigo-400">
            Management
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Students
          </h1>

          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Manage and view all registered students.
          </p>
        </div>

        <button
          onClick={() => navigate("/students/add")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-500 hover:to-violet-500"
        >
          <Plus size={18} />
          Add Student
        </button>
      </div>

      {/* Search & Sort */}
      <div className="rounded-2xl border border-indigo-500/15 bg-[#0c1029]/80 p-4 shadow-lg shadow-black/10 backdrop-blur-xl">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              placeholder="Search students by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-[#07091c]/80 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>

          {/* Sort */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="rounded-xl border border-slate-800 bg-[#07091c]/80 px-4 py-3.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10 lg:w-52"
          >
            <option value="asc">
              Name: A → Z
            </option>

            <option value="desc">
              Name: Z → A
            </option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-indigo-500/15 bg-[#0c1029]/80 shadow-lg shadow-black/10 backdrop-blur-xl">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Loader2
                size={21}
                className="animate-spin text-indigo-400"
              />
              Loading students...
            </div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10">
              <Users
                size={26}
                className="text-indigo-400"
              />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-white">
              No students found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-500">
              {search
                ? "No students match your search."
                : "Add your first student to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1250px]">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-950/30">
                  <th className="w-[22%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Student
                  </th>

                  <th className="w-[19%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Email
                  </th>

                  <th className="w-[12%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Course
                  </th>

                  <th className="w-[7%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Age
                  </th>

                  <th className="w-[15%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Phone
                  </th>

                  <th className="w-[17%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Address
                  </th>

                  <th className="w-[8%] px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60">
                {currentStudents.map((student) => (
                  <tr
                    key={student._id}
                    className="transition hover:bg-indigo-500/5"
                  >
                    {/* Student */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-indigo-500/20 bg-indigo-500/10">
                          {student.profilePhoto?.url ? (
                            <img
                              src={student.profilePhoto.url}
                              alt={`${student.name} profile`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User
                              size={20}
                              className="text-indigo-400"
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-white">
                            {student.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            ID: {student._id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-5">
                      <p className="truncate text-sm text-slate-300">
                        {student.email}
                      </p>
                    </td>

                    {/* Course */}
                    <td className="px-6 py-5">
                      <span className="inline-flex rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300 ring-1 ring-indigo-500/10">
                        {student.course}
                      </span>
                    </td>

                    {/* Age */}
                    <td className="px-6 py-5 text-sm text-slate-300">
                      {student.age}
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Phone
                          size={15}
                          className="shrink-0 text-slate-500"
                        />

                        <span>{student.phone}</span>
                      </div>
                    </td>

                    {/* Address */}
                    <td className="px-6 py-5">
                      <div className="flex max-w-[230px] items-start gap-2 text-sm text-slate-400">
                        <MapPin
                          size={15}
                          className="mt-0.5 shrink-0 text-slate-500"
                        />

                        <span className="line-clamp-2">
                          {student.address}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        {/* Edit */}
                        <button
                          onClick={() =>
                            navigate(
                              `/students/edit/${student._id}`
                            )
                          }
                          className="rounded-lg border border-slate-800 bg-slate-950/40 p-2.5 text-slate-400 transition hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-400"
                          title="Edit student"
                        >
                          <Pencil size={16} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() =>
                            setDeleteStudent(student)
                          }
                          className="rounded-lg border border-slate-800 bg-slate-950/40 p-2.5 text-slate-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                          title="Delete student"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom section */}
      {!loading && filteredStudents.length > 0 && (
        <div className="flex flex-col gap-4 px-1 sm:flex-row sm:items-center sm:justify-between">
          {/* Result count */}
          <p className="text-xs text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-300">
              {startIndex + 1}
            </span>
            {" - "}
            <span className="font-medium text-slate-300">
              {Math.min(
                endIndex,
                filteredStudents.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-300">
              {filteredStudents.length}
            </span>{" "}
            students
          </p>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              {/* Previous */}
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((previous) =>
                    Math.max(previous - 1, 1)
                  )
                }
                disabled={currentPage === 1}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-950/40 text-slate-400 transition hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-400 disabled:cursor-not-allowed disabled:opacity-30"
                title="Previous page"
              >
                <ChevronLeft size={17} />
              </button>

              {/* Page Numbers */}
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition ${
                    currentPage === page
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20"
                      : "border border-slate-800 bg-slate-950/40 text-slate-400 hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-400"
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next */}
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((previous) =>
                    Math.min(
                      previous + 1,
                      totalPages
                    )
                  )
                }
                disabled={currentPage === totalPages}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-950/40 text-slate-400 transition hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-400 disabled:cursor-not-allowed disabled:opacity-30"
                title="Next page"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0c1029] p-6 shadow-2xl shadow-black/40">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 ring-1 ring-red-500/20">
                  <AlertTriangle
                    size={22}
                    className="text-red-400"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Delete Student
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setDeleteStudent(null)
                }
                disabled={deleting}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Student Info */}
            <div className="mt-6 rounded-xl border border-slate-800/80 bg-slate-950/30 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-indigo-500/20 bg-indigo-500/10">
                  {deleteStudent.profilePhoto?.url ? (
                    <img
                      src={deleteStudent.profilePhoto.url}
                      alt={`${deleteStudent.name} profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User
                      size={19}
                      className="text-indigo-400"
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {deleteStudent.name}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {deleteStudent.email}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-400">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-white">
                {deleteStudent.name}
              </span>
              ? The student record and associated profile
              photo will be permanently removed.
            </p>

            {/* Modal Actions */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setDeleteStudent(null)
                }
                disabled={deleting}
                className="rounded-xl border border-slate-800 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-700 hover:bg-white/[0.03] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/10 transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={17} />
                    Delete Student
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;