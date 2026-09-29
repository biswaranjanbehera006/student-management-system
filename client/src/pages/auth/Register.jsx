import { useState } from "react";
import {
  UserRound,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AuthLayout from "../../layouts/AuthLayout";
import api from "../../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (name.length < 2) {
      toast.error("Name must contain at least 2 characters.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      toast.success(
        response.data?.message ||
          "Registration successful. OTP sent to your email."
      );

      navigate("/verify-otp", {
        state: {
          email,
        },
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to create your account. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-4 text-center sm:mb-5">
          {/* Icon */}
          <div
            className="
              mx-auto
              mb-2.5
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-indigo-300/20
              bg-indigo-500/10
              text-indigo-300
              shadow-[0_8px_25px_rgba(99,102,241,0.12)]
            "
          >
            <UserRound
              size={21}
              strokeWidth={2}
            />
          </div>

          {/* Heading */}
          <h2
            className="
              text-[26px]
              font-bold
              leading-tight
              tracking-tight
              text-white
              sm:text-[29px]
            "
          >
            Create your account
          </h2>

          {/* Description */}
          <p
            className="
              mx-auto
              mt-1.5
              max-w-[380px]
              text-sm
              leading-5
              text-slate-400
            "
          >
            Create your StudentHub account and start
            managing your student records.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto w-full max-w-[430px]"
        >
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="
                mb-1.5
                block
                text-sm
                font-medium
                text-slate-200
              "
            >
              Full name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className="
                h-[44px]
                w-full
                rounded-xl
                border
                border-white/10
                bg-white/[0.055]
                px-4
                text-sm
                text-white
                outline-none
                transition-all
                placeholder:text-slate-500
                hover:border-white/20
                hover:bg-white/[0.075]
                focus:border-indigo-400/60
                focus:bg-white/[0.09]
                focus:ring-4
                focus:ring-indigo-500/10
              "
            />
          </div>

          {/* Email */}
          <div className="mt-3.5">
            <label
              htmlFor="email"
              className="
                mb-1.5
                block
                text-sm
                font-medium
                text-slate-200
              "
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="
                h-[44px]
                w-full
                rounded-xl
                border
                border-white/10
                bg-white/[0.055]
                px-4
                text-sm
                text-white
                outline-none
                transition-all
                placeholder:text-slate-500
                hover:border-white/20
                hover:bg-white/[0.075]
                focus:border-indigo-400/60
                focus:bg-white/[0.09]
                focus:ring-4
                focus:ring-indigo-500/10
              "
            />
          </div>

          {/* Password */}
          <div className="mt-3.5">
            <label
              htmlFor="password"
              className="
                mb-1.5
                block
                text-sm
                font-medium
                text-slate-200
              "
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={
                  showPassword ? "text" : "password"
                }
                autoComplete="new-password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="
                  h-[44px]
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.055]
                  px-4
                  pr-12
                  text-sm
                  text-white
                  outline-none
                  transition-all
                  placeholder:text-slate-500
                  hover:border-white/20
                  hover:bg-white/[0.075]
                  focus:border-indigo-400/60
                  focus:bg-white/[0.09]
                  focus:ring-4
                  focus:ring-indigo-500/10
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (previous) => !previous
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  rounded-lg
                  p-1.5
                  text-slate-500
                  transition
                  hover:bg-white/10
                  hover:text-slate-300
                "
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mt-3.5">
            <label
              htmlFor="confirmPassword"
              className="
                mb-1.5
                block
                text-sm
                font-medium
                text-slate-200
              "
            >
              Confirm password
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                autoComplete="new-password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="
                  h-[44px]
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.055]
                  px-4
                  pr-12
                  text-sm
                  text-white
                  outline-none
                  transition-all
                  placeholder:text-slate-500
                  hover:border-white/20
                  hover:bg-white/[0.075]
                  focus:border-indigo-400/60
                  focus:bg-white/[0.09]
                  focus:ring-4
                  focus:ring-indigo-500/10
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (previous) => !previous
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  rounded-lg
                  p-1.5
                  text-slate-500
                  transition
                  hover:bg-white/10
                  hover:text-slate-300
                "
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Create Account */}
          <div className="mt-4">
            <button
              type="submit"
              disabled={loading}
              className="
                group
                flex
                h-[44px]
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-indigo-500
                to-violet-600
                px-5
                text-sm
                font-semibold
                text-white
                shadow-[0_10px_30px_rgba(99,102,241,0.22)]
                transition-all
                hover:from-indigo-400
                hover:to-violet-500
                hover:shadow-[0_12px_35px_rgba(99,102,241,0.32)]
                focus:outline-none
                focus:ring-4
                focus:ring-indigo-500/20
                active:scale-[0.99]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Creating account...
                </>
              ) : (
                <>
                  Create account

                  <ArrowRight
                    size={18}
                    className="
                      transition-transform
                      duration-200
                      group-hover:translate-x-1
                    "
                  />
                </>
              )}
            </button>
          </div>

          {/* Login */}
          <div
            className="
              mt-4
              border-t
              border-white/10
              pt-3.5
              text-center
            "
          >
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="
                  font-semibold
                  text-indigo-300
                  transition
                  hover:text-indigo-200
                "
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Register;