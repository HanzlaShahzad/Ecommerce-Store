import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { clearCart } from "../Slices/cartSlice";
import api from "../utils/api";

export default function Success() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("checking");
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    let active = true;
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      if (!sessionId) {
        setStatus("unverified");
        return;
      }

      try {
        const response = await api.get(
          `/checkout-session/${encodeURIComponent(sessionId)}`,
        );
        if (!active) return;

        if (response.data?.paid) {
          setStatus("paid");
          setOrderId(response.data.orderId || "");
          dispatch(clearCart());
        } else {
          setStatus("pending");
        }
      } catch {
        if (active) setStatus("unverified");
      }
    };

    verifyPayment();
    return () => {
      active = false;
    };
  }, [dispatch, searchParams]);

  return (
    <div className="flex min-h-[65vh] items-center justify-center bg-slate-50 px-4 lg:ml-64">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg border border-gray-100">
        {/* Success Icon */}
        <div
          className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
            status === "paid" ? "bg-green-100" : "bg-orange-100"
          }`}
        >
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-full text-white ${
              status === "paid" ? "bg-green-500" : "bg-orange-500"
            }`}
          >
            {status === "checking" ? (
              <span className="h-7 w-7 animate-spin rounded-full border-4 border-white/40 border-t-white" />
            ) : status === "paid" ? (
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
            ) : (
              <span className="text-2xl font-bold" aria-hidden="true">!</span>
            )}
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900">
          {status === "checking"
            ? "Verifying payment"
            : status === "paid"
              ? "Payment successful"
              : status === "pending"
                ? "Payment processing"
                : "Payment not verified"}
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          {status === "paid"
            ? "Thanks for your purchase. Your payment is confirmed and your order is being prepared."
            : status === "checking"
              ? "We’re checking the payment status with Stripe."
              : status === "pending"
                ? "Stripe has not confirmed this payment yet. Please check your orders again shortly."
                : "We couldn’t verify this payment. Your order will not be marked paid until Stripe confirms it."}
        </p>

        {status === "paid" && (
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
          {orderId && (
            <p className="mt-3 border-t border-green-100 pt-3 text-xs text-gray-500">
              Order reference: <span className="font-mono">{orderId}</span>
            </p>
          )}
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 space-y-3">
          <Link
            to="/"
            className="block w-full rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-orange-600 hover:shadow-lg"
          >
            Continue Shopping
          </Link>

          {status === "paid" && (
            <Link
              to="/myOrders"
              className="block w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:border-orange-300 hover:text-orange-500"
            >
              View My Orders
            </Link>
          )}
        </div>

        <p className="mt-6 text-xs text-gray-400">
          🔒 Your payment was securely processed by Stripe.
        </p>
      </div>
    </div>
  );
}
