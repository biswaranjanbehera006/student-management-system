import { GraduationCap } from "lucide-react";

const AuthLayout = ({ children }) => {
  return (
    <main
      className="
        relative
        min-h-screen
        overflow-x-hidden
        bg-[#070A1B]
      "
    >
      {/* Background */}
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_15%_15%,rgba(99,102,241,0.20),transparent_30%),radial-gradient(circle_at_85%_85%,rgba(124,58,237,0.22),transparent_32%),linear-gradient(135deg,#050816_0%,#090D24_50%,#160B2D_100%)]
        "
      />

      {/* Background glow */}
      <div
        className="
          pointer-events-none
          absolute
          -left-40
          -top-40
          h-[420px]
          w-[420px]
          rounded-full
          bg-indigo-600/15
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          -right-40
          h-[480px]
          w-[480px]
          rounded-full
          bg-violet-600/15
          blur-[130px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[300px]
          w-[300px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-indigo-500/5
          blur-[100px]
        "
      />

      {/* Decorative dots */}
      <div
        className="
          pointer-events-none
          absolute
          left-[10%]
          top-[22%]
          h-2
          w-2
          rounded-full
          bg-indigo-400/60
          shadow-[0_0_18px_rgba(129,140,248,0.8)]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[12%]
          top-[28%]
          h-1.5
          w-1.5
          rounded-full
          bg-violet-400/70
          shadow-[0_0_15px_rgba(167,139,250,0.8)]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-[18%]
          left-[18%]
          h-1.5
          w-1.5
          rounded-full
          bg-blue-400/60
          shadow-[0_0_15px_rgba(96,165,250,0.8)]
        "
      />

      {/* Page content */}
      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          flex-col
          items-center
          px-4
          py-6
          sm:px-6
          sm:py-8
        "
      >
        {/* Brand */}
        <div
          className="
            flex
            shrink-0
            items-center
            gap-3
          "
        >
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-gradient-to-br
              from-indigo-500
              to-violet-600
              text-white
              shadow-[0_8px_30px_rgba(99,102,241,0.35)]
              sm:h-12
              sm:w-12
            "
          >
            <GraduationCap
              size={25}
              strokeWidth={2}
            />
          </div>

          <div>
            <h1
              className="
                text-xl
                font-bold
                tracking-tight
                text-white
                sm:text-2xl
              "
            >
              StudentHub
            </h1>

            <p
              className="
                mt-0.5
                text-xs
                font-medium
                text-indigo-300
                sm:text-sm
              "
            >
              Management System
            </p>
          </div>
        </div>

        {/* Card */}
        <div
          className="
            flex
            w-full
            flex-1
            items-center
            justify-center
            py-8
            sm:py-10
          "
        >
          <section
            className="
              w-full
              max-w-[540px]
              rounded-[26px]
              border
              border-indigo-300/20
              bg-white/[0.075]
              px-6
              py-7
              shadow-[0_25px_70px_rgba(0,0,0,0.45)]
              backdrop-blur-2xl
              sm:px-9
              sm:py-8
            "
          >
            {children}
          </section>
        </div>

        {/* Footer */}
        <p
          className="
            shrink-0
            pb-1
            text-center
            text-xs
            text-slate-500
          "
        >
          © 2026 StudentHub. All rights reserved.
        </p>
      </div>
    </main>
  );
};

export default AuthLayout;