import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyEmailMessage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");

  const [resending, setResending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // 15 second countdown
  const [countdown, setCountdown] = useState(15);

  // ==========================================
  // 15 SECOND TIMER
  // ==========================================

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // ==========================================
  // RESEND VERIFICATION EMAIL
  // ==========================================

  const handleResendVerification = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    try {
      setResending(true);

      const res = await axios.post(
        "http://localhost:2000/resend-verification",
        {
          email: email.trim(),
        },
      );

      setSuccessMessage(
        res.data?.message || "A new verification email has been sent.",
      );

      // Start another 15 second countdown
      setCountdown(15);
    } catch (error) {
      console.log("Resend Error:", error);

      setErrorMessage(
        error?.response?.data?.message ||
          error?.response?.data?.msg ||
          error?.message ||
          "Failed to resend verification email.",
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl sm:p-8">
        {/* EMAIL ICON */}

        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-100">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              className="h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l9 6 9-6"
              />

              <rect x="3" y="5" width="18" height="14" rx="2" />
            </svg>
          </div>
        </div>

        {/* TITLE */}

        <h1 className="text-3xl font-bold text-gray-900">Email Not Verified</h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Your account has been created, but your email address has not been
          verified yet.
        </p>

        {/* EMAIL */}

        <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-xs font-medium text-orange-600">
            Verification email sent to
          </p>

          <p className="mt-1 break-all text-sm font-bold text-orange-700">
            {email || "Your registered email"}
          </p>
        </div>

        {/* ERROR */}

        {errorMessage && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                !
              </div>

              <p className="text-left text-sm font-semibold leading-6 text-red-600">
                {errorMessage}
              </p>
            </div>
          </div>
        )}

        {/* SUCCESS */}

        {successMessage && (
          <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">
                ✓
              </div>

              <div className="text-left">
                <p className="text-sm font-semibold text-green-700">
                  {successMessage}
                </p>

                <p className="mt-1 text-xs leading-5 text-green-600">
                  Please check your Gmail inbox and click the new verification
                  link.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* INSTRUCTIONS */}

        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-left">
          <p className="text-sm font-bold text-gray-800">What should you do?</p>

          <div className="mt-3 space-y-2 text-sm text-gray-500">
            <p>1. Open your Gmail inbox.</p>
            <p>2. Find the verification email.</p>
            <p>3. Click the verification link.</p>
            <p>4. Your account will be verified automatically.</p>
          </div>
        </div>

        {/* EMAIL INPUT */}

        <div className="mt-6 text-left">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMessage("");
              setSuccessMessage("");
            }}
            placeholder="you@gmail.com"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-gray-200"
          />
        </div>

        {/* RESEND BUTTON */}

        <button
          type="button"
          onClick={handleResendVerification}
          disabled={resending || countdown > 0}
          className={`mt-4 w-full rounded-xl px-5 py-3.5 font-semibold text-white transition active:scale-[0.98] ${
            countdown > 0 || resending
              ? "cursor-not-allowed bg-gray-400"
              : "bg-black hover:bg-gray-800"
          }`}
        >
          {resending
            ? "Sending Verification Email..."
            : countdown > 0
              ? `Resend Verification Email (${countdown}s)`
              : "Resend Verification Email"}
        </button>

        {/* BACK TO SIGN IN */}

        <button
          type="button"
          onClick={() => navigate("/signin")}
          className="mt-3 w-full rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 active:scale-[0.98]"
        >
          Back to Sign In
        </button>

        <p className="mt-5 text-xs text-gray-400">
          Verification links expire after 15 minutes.
        </p>
      </div>
    </div>
  );
}
