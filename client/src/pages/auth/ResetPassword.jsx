import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AuthLayout from "../../layouts/AuthLayout";
import api from "../../services/api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpVerified, setOtpVerified] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      toast.error("Please request a password reset first.");
      navigate("/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const updatedOtp = [...otp];
    updatedOtp[index] = digit;
    setOtp(updatedOtp);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();

    const pastedValue = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedValue) return;

    const updatedOtp = [...otp];

    pastedValue.split("").forEach((digit, index) => {
      updatedOtp[index] = digit;
    });

    setOtp(updatedOtp);

    const nextIndex = Math.min(pastedValue.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      setVerifyLoading(true);

      const response = await api.post("/auth/verify-reset-otp", {
        email,
        otp: enteredOtp,
      });

      toast.success(
        response.data?.message || "OTP verified successfully."
      );

      setOtpVerified(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Invalid or expired OTP. Please try again."
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      toast.error("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (!confirmPassword) {
      toast.error("Please confirm your password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setResetLoading(true);

      const response = await api.post("/auth/reset-password", {
        email,
        otp: otp.join(""),
        newPassword,
      });

      toast.success(
        response.data?.message ||
          "Password reset successfully. You can now login."
      );

      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to reset password. Please try again."
      );
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-300/20 bg-indigo-500/10 text-indigo-300 shadow-[0_8px_25px_rgba(99,102,241,0.12)]">
            {otpVerified ? (
              <LockKeyhole size={23} strokeWidth={2} />
            ) : (
              <KeyRound size={23} strokeWidth={2} />
            )}
          </div>

          <h2 className="text-[27px] font-bold leading-tight tracking-tight text-white sm:text-[30px]">
            {otpVerified ? "Create new password" : "Verify reset code"}
          </h2>

          <p className="mx-auto mt-2 max-w-[390px] text-sm leading-6 text-slate-400 sm:text-[15px]">
            {otpVerified
              ? "Enter a new password for your account."
              : "Enter the 6-digit verification code sent to your email address."}
          </p>

          {email && (
            <p className="mt-2 truncate text-xs font-medium text-indigo-300">
              {email}
            </p>
          )}
        </div>

        {!otpVerified ? (
          /* OTP Verification */
          <form
            onSubmit={handleVerifyOtp}
            className="mx-auto w-full max-w-[430px]"
          >
            <div>
              <label className="mb-3 block text-center text-sm font-medium text-slate-200">
                Verification code
              </label>

              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      inputRefs.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleOtpChange(index, e.target.value)
                    }
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    autoFocus={index === 0}
                    className="h-12 w-11 rounded-xl border border-white/10 bg-white/[0.055] text-center text-lg font-semibold text-white outline-none transition-all placeholder:text-slate-500 hover:border-white/20 hover:bg-white/[0.075] focus:border-indigo-400/60 focus:bg-white/[0.09] focus:ring-4 focus:ring-indigo-500/10 sm:h-[52px] sm:w-[52px]"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={verifyLoading}
              className="mt-7 flex h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(99,102,241,0.22)] transition-all hover:from-indigo-400 hover:to-violet-500 hover:shadow-[0_12px_35px_rgba(99,102,241,0.32)] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {verifyLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify code
                  <CheckCircle2 size={18} />
                </>
              )}
            </button>

            <div className="mt-6 text-center">
              <Link
                to="/forgot-password"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
              >
                <ArrowLeft size={16} />
                Try another email
              </Link>
            </div>
          </form>
        ) : (
          /* New Password */
          <form
            onSubmit={handleResetPassword}
            className="mx-auto w-full max-w-[430px]"
          >
            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                New password
              </label>

              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-[48px] w-full rounded-xl border border-white/10 bg-white/[0.055] px-4 pr-12 text-sm text-white outline-none transition-all placeholder:text-slate-500 hover:border-white/20 hover:bg-white/[0.075] focus:border-indigo-400/60 focus:bg-white/[0.09] focus:ring-4 focus:ring-indigo-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
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
            <div className="mt-5">
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Confirm new password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  className="h-[48px] w-full rounded-xl border border-white/10 bg-white/[0.055] px-4 pr-12 text-sm text-white outline-none transition-all placeholder:text-slate-500 hover:border-white/20 hover:bg-white/[0.075] focus:border-indigo-400/60 focus:bg-white/[0.09] focus:ring-4 focus:ring-indigo-500/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-3 rounded-lg border border-indigo-400/10 bg-indigo-500/[0.04] px-3 py-2.5">
              <p className="text-xs leading-5 text-slate-400">
                Password must contain at least 6 characters.
              </p>
            </div>

            <button
              type="submit"
              disabled={resetLoading}
              className="mt-6 flex h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(99,102,241,0.22)] transition-all hover:from-indigo-400 hover:to-violet-500 hover:shadow-[0_12px_35px_rgba(99,102,241,0.32)] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resetLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Resetting password...
                </>
              ) : (
                <>
                  Reset password
                  <CheckCircle2 size={18} />
                </>
              )}
            </button>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
              >
                <ArrowLeft size={16} />
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;