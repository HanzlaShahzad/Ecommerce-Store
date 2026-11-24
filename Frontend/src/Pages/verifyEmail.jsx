import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const res = await api.get(`/verify-email/${token}`);

        if (res.data?.success) {
          setVerified(true);
        } else {
          setErrorMessage(res.data?.message || "Email verification failed.");
        }
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message ||
            error?.response?.data?.msg ||
            error?.message ||
            "Invalid or expired verification token.",
        );

        setVerified(false);
      } finally {
        setLoading(false);
      }
    };

    if (token) verifyEmail();
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-slate-50 px-4 lg:ml-64">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

          <h1 className="text-2xl font-bold text-gray-900">Verifying Email</h1>

          <p className="mt-2 text-sm text-gray-500">
            Please wait while we verify your email...
          </p>
        </div>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-slate-50 px-4 lg:ml-64">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          {/* GREEN CHECK */}

          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                className="h-9 w-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="mb-3 text-3xl font-bold text-gray-900">
            Email Verified!
          </h1>

          <p className="mb-6 text-gray-600">
            Your email address has been successfully verified. Your account is
            now ready to use.
          </p>

          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
            <p className="text-sm font-semibold text-green-700">
              ✓ Your account has been activated successfully.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/signin")}
            className="w-full rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98]"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // INVALID / EXPIRED TOKEN
  // ==========================================

  return (
    <div className="flex min-h-[65vh] items-center justify-center bg-slate-50 px-4 py-8 lg:ml-64">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl sm:p-8">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              className="h-7 w-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          Verification Failed
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          This verification link is invalid or has expired.
        </p>

        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-semibold text-red-600">{errorMessage}</p>
        </div>

        {/* GO TO RESEND PAGE */}

        <button
          type="button"
          onClick={() => navigate("/verify-email")}
          className="mt-6 w-full rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98]"
        >
          Resend Verification Email
        </button>

        <button
          type="button"
          onClick={() => navigate("/signin")}
          className="mt-3 w-full rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
}
