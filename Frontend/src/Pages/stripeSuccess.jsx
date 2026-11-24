import { Link } from "react-router-dom";

export default function Success() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg border border-gray-100">
        {/* Success Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
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
        <h1 className="text-3xl font-bold text-gray-900">
          Payment Successful!
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Thank you for your purchase. Your payment has been successfully
          processed and your order is now being prepared.
        </p>

        {/* Order Status */}
        <div className="mt-6 rounded-xl bg-green-50 p-4 text-left">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Payment Status</span>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-600">
              Paid
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-gray-500">Order Status</span>

            <span className="text-sm font-semibold text-gray-800">
              Processing
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 space-y-3">
          <Link
            to="/"
            className="block w-full rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-orange-600 hover:shadow-lg"
          >
            Continue Shopping
          </Link>

          {
            <Link
              to="/myOrders"
              className="block w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:border-orange-300 hover:text-orange-500"
            >
              View My Orders
            </Link>
          }
        </div>

        <p className="mt-6 text-xs text-gray-400">
          🔒 Your payment was securely processed by Stripe.
        </p>
      </div>
    </div>
  );
}
