import { Link } from "react-router-dom";

export default function Cancel() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg border border-gray-100">
        {/* Cancel Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900">Payment Cancelled</h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Your payment was cancelled and no money was charged. Your cart items
          are still waiting for you.
        </p>

        {/* Status */}
        <div className="mt-6 rounded-xl bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-600">
            Payment was not completed
          </p>

          <p className="mt-1 text-xs text-gray-500">
            You can return to checkout and try again.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 space-y-3">
          <Link
            to="/checkout"
            className="block w-full rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-orange-600 hover:shadow-lg"
          >
            Try Payment Again
          </Link>

          <Link
            to="/"
            className="block w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:border-orange-300 hover:text-orange-500"
          >
            Continue Shopping
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Need help? Please contact our support team.
        </p>
      </div>
    </div>
  );
}
