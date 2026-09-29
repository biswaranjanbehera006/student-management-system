import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, MailCheck, RefreshCw } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import AuthLayout from "../../layouts/AuthLayout";
import api from "../../services/api";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const inputRefs = useRef([]);

  // Redirect if email is missing
  useEffect(() => {
    if (!email) {
      navigate("/register", { replace: true });
    }
  }, [email, navigate]);

  // Resend countdown
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);

    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pastedData = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    const newOtp = ["", "", "", "", "", ""];

    pastedData.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async (event) => {
    event.preventDefault();

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/verify-otp", {
        email,
        otp: otpValue,
      });

      if (response.data.success) {
        toast.success("Email verified successfully");

        setTimeout(() => {
          navigate("/login");
        }, 700);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to verify OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resendLoading) return;

    try {
      setResendLoading(true);

      const response = await api.post("/auth/resend-otp", {
        email,
      });

      if (response.data.success) {
        toast.success("A new OTP has been sent to your email");

        setOtp(["", "", "", "", "", ""]);
        setCountdown(60);

        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 100);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to resend OTP. Please try again."
      );
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-[560px] text-center">
        {/* Icon */}
        <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300 shadow-[0_10px_35px_rgba(99,102,241,0.12)]">
          <MailCheck size={30} strokeWidth={1.8} />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Verify your email
        </h1>

        <p className="mx-auto mt-4 max-w-[480px] text-sm leading-6 text-slate-400 sm:text-base">
          We've sent a 6-digit verification code to your email address.
        </p>

        {/* Email */}
        <p className="mt-3 break-all text-sm font-semibold text-indigo-300 sm:text-base">
          {email}
        </p>

        {/* OTP Form */}
        <form onSubmit={handleVerify} className="mt-9">
          <div
            className="flex justify-center gap-2 sm:gap-3"
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(event) =>
                  handleChange(index, event.target.value)
                }
                onKeyDown={(event) => handleKeyDown(index, event)}
                className="
                  h-14
                  w-11
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.06]
                  text-center
                  text-xl
                  font-semibold
                  text-white
                  outline-none
                  transition
                  placeholder:text-slate-600
                  focus:border-indigo-400/60
                  focus:bg-indigo-500/[0.08]
                  focus:ring-4
                  focus:ring-indigo-500/10
                  sm:h-16
                  sm:w-14
                  sm:text-2xl
                "
              />
            ))}
          </div>

          {/* Verify button */}
          <button
            type="submit"
            disabled={loading}
            className="
              mt-8
              flex
              w-full
              items-center
              justify-center
              gap-3
              rounded-xl
              bg-gradient-to-r
              from-indigo-500
              to-violet-600
              px-6
              py-4
              text-sm
              font-semibold
              text-white
              shadow-[0_12px_35px_rgba(99,102,241,0.25)]
              transition
              hover:from-indigo-400
              hover:to-violet-500
              disabled:cursor-not-allowed
              disabled:opacity-60
              sm:text-base
            "
          >
            {loading ? (
              <>
                <RefreshCw size={19} className="animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Verify email
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="
            mt-7
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-slate-400
            transition
            hover:text-white
          "
        >
          <ArrowLeft size={17} />
          Back to registration
        </button>

        {/* Divider */}
        <div className="my-7 h-px bg-white/10" />

        {/* Resend */}
        <div className="text-sm">
          <p className="text-slate-500">
            Didn't receive the code?
          </p>

          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0 || resendLoading}
            className="
              mt-2
              inline-flex
              items-center
              gap-2
              font-semibold
              text-indigo-300
              transition
              hover:text-indigo-200
              disabled:cursor-not-allowed
              disabled:text-slate-600
            "
          >
            {resendLoading && (
              <RefreshCw size={15} className="animate-spin" />
            )}

            {resendLoading
              ? "Sending..."
              : countdown > 0
              ? `Resend OTP in ${countdown}s`
              : "Resend OTP"}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyOTP;