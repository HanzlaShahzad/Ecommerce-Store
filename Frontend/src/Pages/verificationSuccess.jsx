import { Link } from "react-router-dom";

export default function VerificationSuccess() {
  return (
    <div className="flex min-h-[65vh] items-center justify-center bg-slate-50 px-4 lg:ml-64">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        {/* Green Tick */}
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

        {/* Heading */}
        <h1 className="mb-3 text-3xl font-bold text-gray-900">
          Email Verified!
        </h1>

        {/* Message */}
        <p className="mb-6 text-gray-600">
          Your email address has been successfully verified. Your account is now
          ready to use.
        </p>

        {/* Success message */}
        <div className="mb-6 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          ✓ Your account has been activated successfully.
        </div>

        {/* Sign In Button */}
        <Link
          to="/signin"
          className="block w-full rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white transition duration-200 hover:bg-orange-700"
        >
          Continue to Sign In
        </Link>
      </div>
    </div>
  );
}
