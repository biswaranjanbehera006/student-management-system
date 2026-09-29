import { useEffect, useMemo, useState } from "react";

import {
  BookOpen,
  Search,
  Users,
  Loader2,
  GraduationCap,
  UserRound,
} from "lucide-react";

import toast from "react-hot-toast";

import api from "../services/api";

const Courses = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================================================
  // FETCH STUDENTS
  // =========================================================

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response = await api.get("/students");

      setStudents(response.data.data || []);
    } catch (error) {
      console.error("Courses data error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load courses"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // =========================================================
  // CREATE COURSE DATA
  // =========================================================

  const courses = useMemo(() => {
    const courseMap = {};

    students.forEach((student) => {
      const courseName = student.course?.trim();

      if (!courseName) {
        return;
      }

      if (!courseMap[courseName]) {
        courseMap[courseName] = {
          name: courseName,
          students: [],
        };
      }

      courseMap[courseName].students.push(student);
    });

    return Object.values(courseMap).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [students]);

  // =========================================================
  // SEARCH COURSES
  // =========================================================

  const filteredCourses = courses.filter((course) =>
    course.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // =========================================================
  // TOTAL STUDENTS
  // =========================================================

  const totalStudents = students.length;

  // =========================================================
  // GET COURSE COLOR STYLE
  // =========================================================

  const getCourseIcon = (index) => {
    const icons = [
      BookOpen,
      GraduationCap,
      Users,
      UserRound,
    ];

    return icons[index % icons.length];
  };

  return (
    <div className="w-full space-y-7 px-6 py-6 lg:px-8">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div>
        <p className="mb-2 text-sm font-medium text-indigo-400">
          Academic
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Courses
            </h1>

            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              View courses and their registered students.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Total Courses */}
        <div className="rounded-2xl border border-indigo-500/15 bg-[#0c1029]/80 p-5 shadow-lg shadow-black/10 backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">
                Total Courses
              </p>

              <div className="mt-3">
                {loading ? (
                  <Loader2
                    size={28}
                    className="animate-spin text-indigo-400"
                  />
                ) : (
                  <h2 className="text-3xl font-bold text-white">
                    {courses.length}
                  </h2>
                )}
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Available courses
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 ring-1 ring-indigo-500/20">
              <BookOpen
                size={23}
                className="text-indigo-400"
              />
            </div>
          </div>
        </div>

        {/* Total Enrolled Students */}
        <div className="rounded-2xl border border-indigo-500/15 bg-[#0c1029]/80 p-5 shadow-lg shadow-black/10 backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">
                Total Students
              </p>

              <div className="mt-3">
                {loading ? (
                  <Loader2
                    size={28}
                    className="animate-spin text-indigo-400"
                  />
                ) : (
                  <h2 className="text-3xl font-bold text-white">
                    {totalStudents}
                  </h2>
                )}
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Registered across all courses
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 ring-1 ring-indigo-500/20">
              <Users
                size={23}
                className="text-indigo-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          SEARCH
      ====================================================== */}

      <div className="rounded-2xl border border-indigo-500/15 bg-[#0c1029]/80 p-4 shadow-lg shadow-black/10 backdrop-blur-xl">
        <div className="relative">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-[#07091c]/80 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10"
          />
        </div>
      </div>

      {/* =====================================================
          COURSE LIST
      ====================================================== */}

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-indigo-500/15 bg-[#0c1029]/80">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <Loader2
              size={21}
              className="animate-spin text-indigo-400"
            />

            Loading courses...
          </div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-indigo-500/15 bg-[#0c1029]/80 px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10">
            <BookOpen
              size={26}
              className="text-indigo-400"
            />
          </div>

          <h3 className="mt-4 text-lg font-semibold text-white">
            No courses found
          </h3>

          <p className="mt-1 max-w-sm text-sm text-slate-500">
            {search
              ? "No courses match your search."
              : "Add students with course information to see courses here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course, index) => {
            const Icon = getCourseIcon(index);

            const studentCount = course.students.length;

            const percentage =
              totalStudents > 0
                ? Math.round(
                    (studentCount / totalStudents) * 100
                  )
                : 0;

            return (
              <div
                key={course.name}
                className="overflow-hidden rounded-2xl border border-indigo-500/15 bg-[#0c1029]/80 shadow-lg shadow-black/10 backdrop-blur-xl transition hover:border-indigo-500/30 hover:bg-[#0f1433]"
              >
                {/* Course Header */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 ring-1 ring-indigo-500/20">
                        <Icon
                          size={21}
                          className="text-indigo-400"
                        />
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-semibold text-white">
                          {course.name}
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                          Course
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-lg bg-indigo-500/10 px-2.5 py-1.5 text-xs font-semibold text-indigo-300 ring-1 ring-indigo-500/10">
                      {percentage}%
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Student distribution
                      </span>

                      <span className="text-xs font-medium text-slate-400">
                        {studentCount}{" "}
                        {studentCount === 1
                          ? "student"
                          : "students"}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Students */}
                <div className="border-t border-slate-800/80">
                  <div className="px-5 py-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Registered Students
                      </p>

                      <Users
                        size={15}
                        className="text-slate-600"
                      />
                    </div>

                    <div className="space-y-2.5">
                      {course.students
                        .slice(0, 4)
                        .map((student) => (
                          <div
                            key={student._id}
                            className="flex items-center gap-3"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-indigo-500/15 bg-indigo-500/10">
                              {student.profilePhoto?.url ? (
                                <img
                                  src={
                                    student.profilePhoto.url
                                  }
                                  alt={`${student.name} profile`}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <UserRound
                                  size={15}
                                  className="text-indigo-400"
                                />
                              )}
                            </div>

                            <p className="truncate text-sm text-slate-300">
                              {student.name}
                            </p>
                          </div>
                        ))}

                      {course.students.length > 4 && (
                        <p className="pt-1 text-xs text-slate-500">
                          +{" "}
                          {course.students.length - 4} more
                          students
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Result Count */}
      {!loading &&
        filteredCourses.length > 0 && (
          <div className="px-1 text-xs text-slate-500">
            Showing {filteredCourses.length} of{" "}
            {courses.length} courses
          </div>
        )}
    </div>
  );
};

export default Courses;