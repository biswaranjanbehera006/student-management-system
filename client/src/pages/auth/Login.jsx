import { useState } from "react";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AuthLayout from "../../layouts/AuthLayout";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = formData.email.trim();
    const password = formData.password;

    // Basic validation
    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // Login API
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // Get token and user from backend response
      const { token, user } = response.data.data;

      // Safety check
      if (!token || !user) {
        toast.error("Invalid login response. Please try again.");
        return;
      }

      /*
       * Store authentication information.
       *
       * AuthContext also handles this through login(),
       * but keeping the data flow explicit here ensures
       * the logged-in user information is available
       * immediately after login.
       */
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Update AuthContext
      login(token, user);

      // Success message
      toast.success(
        response.data.message || "Login successful!"
      );

      // Redirect to dashboard
      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Login error:", error);

      const message =
        error.response?.data?.message ||
        "Unable to login. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-5 text-center">
          {/* Lock */}
          <div
            className="
              mx-auto
              mb-3
              flex
              h-12
              w-12
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
            <LockKeyhole size={22} strokeWidth={2} />
          </div>

          {/* Heading */}
          <h2
            className="
              text-[27px]
              font-bold
              leading-tight
              tracking-tight
              text-white
              sm:text-[30px]
            "
          >
            Welcome back
          </h2>

          {/* Description */}
          <p
            className="
              mx-auto
              mt-2
              max-w-[370px]
              text-sm
              leading-5
              text-slate-400
              sm:text-[15px]
              sm:leading-6
            "
          >
            Sign in to your account to continue
            managing your student records.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto w-full max-w-[430px]"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-slate-200"
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
                h-[46px]
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
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-200"
              >
                Password
              </label>

              <Link
                to="/forgot-password"
                className="
                  text-xs
                  font-semibold
                  text-indigo-300
                  transition
                  hover:text-indigo-200
                  sm:text-sm
                "
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="
                  h-[46px]
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

              {/* Show / Hide Password */}
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

          {/* Sign In */}
          <div className="mt-5">
            <button
              type="submit"
              disabled={loading}
              className="
                group
                flex
                h-[46px]
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
                    size={18}
                    className="animate-spin"
                  />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in

                  <ArrowRight
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </div>

          {/* Register */}
          <div className="mt-5 border-t border-white/10 pt-4 text-center">
            <p className="text-sm text-slate-400">
              Don't have an account?{" "}

              <Link
                to="/register"
                className="
                  font-semibold
                  text-indigo-300
                  transition
                  hover:text-indigo-200
                "
              >
                Create account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;