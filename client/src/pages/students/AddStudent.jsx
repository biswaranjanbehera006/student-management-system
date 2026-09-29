import { useState } from "react";

import {
  ArrowLeft,
  Mail,
  User,
  Calendar,
  BookOpen,
  Phone,
  MapPin,
  Camera,
  X,
  Loader2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

const AddStudent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    course: "",
    phone: "",
    address: "",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Only JPG, JPEG, PNG, and WEBP images are allowed"
      );

      e.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Profile photo must be less than 5 MB");

      e.target.value = "";
      return;
    }

    setProfilePhoto(file);

    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  };

  const removePhoto = () => {
    setProfilePhoto(null);
    setPhotoPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.age ||
      !formData.course.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim()
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (Number(formData.age) <= 16) {
      toast.error("Student age must be greater than 16");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name.trim());
      data.append("email", formData.email.trim());
      data.append("age", Number(formData.age));
      data.append("course", formData.course.trim());
      data.append("phone", formData.phone.trim());
      data.append("address", formData.address.trim());

      if (profilePhoto) {
        data.append("profilePhoto", profilePhoto);
      }

      const response = await api.post("/students", data);

      toast.success(
        response.data.message || "Student added successfully"
      );

      navigate("/students");
    } catch (error) {
      console.error("Add student error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to add student"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full rounded-xl border border-slate-800 bg-[#07091c]/80 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10";

  return (
    <div className="w-full space-y-7 px-6 py-6 lg:px-8">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() => navigate("/students")}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Students
        </button>

        <p className="mb-2 text-sm font-medium text-indigo-400">
          Student Management
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Add Student
        </h1>

        <p className="mt-2 text-sm text-slate-400 sm:text-base">
          Add a new student to the management system.
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-indigo-500/15 bg-[#0c1029]/80 shadow-lg shadow-black/10 backdrop-blur-xl">
        <div className="border-b border-slate-800/80 px-6 py-5">
          <h2 className="text-lg font-semibold text-white">
            Student Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Enter the student's details below.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
            {/* Profile Photo */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Profile Photo
              </label>

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                {/* Preview */}
                <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-indigo-500/20 bg-[#07091c]">
                  {photoPreview ? (
                    <>
                      <img
                        src={photoPreview}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-red-500/80"
                        aria-label="Remove photo"
                      >
                        <X size={15} />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-600">
                      <User size={30} />
                      <span className="mt-1 text-[10px]">
                        No photo
                      </span>
                    </div>
                  )}
                </div>

                {/* Upload */}
                <div>
                  <label
                    htmlFor="profilePhoto"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-3 text-sm font-semibold text-indigo-300 transition hover:border-indigo-500/40 hover:bg-indigo-500/20"
                  >
                    <Camera size={18} />
                    Choose Photo
                  </label>

                  <input
                    id="profilePhoto"
                    name="profilePhoto"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />

                  <p className="mt-2 text-xs text-slate-600">
                    JPG, JPEG, PNG or WEBP • Maximum 5 MB
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter student name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Age */}
            <div>
              <label
                htmlFor="age"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Age
              </label>

              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="age"
                  name="age"
                  type="number"
                  min="17"
                  placeholder="Enter age"
                  value={formData.age}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              <p className="mt-1.5 text-xs text-slate-600">
                Age must be greater than 16.
              </p>
            </div>

            {/* Course */}
            <div>
              <label
                htmlFor="course"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Course
              </label>

              <div className="relative">
                <BookOpen
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="course"
                  name="course"
                  type="text"
                  placeholder="Enter course name"
                  value={formData.course}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Phone Number
              </label>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Address
              </label>

              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-4 top-4 text-slate-500"
                />

                <textarea
                  id="address"
                  name="address"
                  rows="1"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`${inputClasses} resize-none py-3.5`}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-800/80 px-6 py-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/students")}
              disabled={loading}
              className="rounded-xl border border-slate-800 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-700 hover:bg-white/[0.03] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Adding Student...
                </>
              ) : (
                "Add Student"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;