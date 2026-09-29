import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Mail,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AuthLayout from "../../layouts/AuthLayout";
import api from "../../services/api";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/forgot-password",
        {
          email: normalizedEmail,
        }
      );

      toast.success(
        response.data?.message ||
          "If an account exists, a reset OTP has been sent."
      );

      navigate("/reset-password", {
        state: {
          email: normalizedEmail,
        },
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-6 text-center">
          {/* Icon */}
          <div
            className="
              mx-auto
              mb-4
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
            <Mail size={23} strokeWidth={2} />
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
            Forgot your password?
          </h2>

          {/* Description */}
          <p
            className="
              mx-auto
              mt-2
              max-w-[390px]
              text-sm
              leading-6
              text-slate-400
              sm:text-[15px]
            "
          >
            Enter your registered email address and
            we'll send you a verification code to
            reset your password.
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
              className="
                mb-2
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                h-[48px]
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

          {/* Submit */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="
                group
                flex
                h-[48px]
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
                  Sending code...
                </>
              ) : (
                <>
                  Send verification code

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

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="
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
              <ArrowLeft size={16} />
              Back to login
            </Link>
          </div>

          {/* Security note */}
          <div
            className="
              mt-6
              border-t
              border-white/10
              pt-5
              text-center
            "
          >
            <p className="text-xs leading-5 text-slate-500">
              For your security, we'll only send a
              reset code if the email is associated
              with an account.
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;