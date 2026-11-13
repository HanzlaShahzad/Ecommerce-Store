import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrder } from "../Thunks/stripeThunk";

export default function MyOrders() {
  const { orders, pending, error } = useSelector((state) => state.getOrders);
  const user = useSelector((state) => state.signin?.data?.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user?._id) {
      dispatch(getOrder({ id: user._id }));
    }
  }, [dispatch]);

  console.log("Orders =>", orders);

  if (pending) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />
          <p className="mt-4 text-sm font-medium text-gray-500">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
            !
          </div>

          <h2 className="mt-4 text-xl font-bold text-gray-800">
            Unable to load orders
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error?.message ||
              "Something went wrong while loading your orders."}
          </p>
        </div>
      </div>
    );
  }

  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">
            🛍️
          </div>

          <h2 className="mt-5 text-2xl font-bold text-gray-800">
            No Orders Yet
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            You haven't placed any orders yet. Your orders will appear here
            after you make a purchase.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-5 sm:px-5 md:px-8 lg:px-10 lg:ml-[250px] ">
      {user ? (
        <div className="mx-auto w-full max-w-6xl">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-800 sm:text-3xl">
                My Orders
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Track and view all your orders
              </p>
            </div>

            <div className="w-fit rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-600">
              {orders.length} {orders.length === 1 ? "Order" : "Orders"}
            </div>
          </div>

          {/* Orders */}
          <div className="space-y-5">
            {orders.map((order, orderIndex) => {
              const isPaid = order?.paymentStatus === "paid";

              return (
                <div
                  key={order?._id || orderIndex}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* Order Header */}
                  <div className="border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white px-4 py-4 sm:px-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Order #{orderIndex + 1}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-700">
                          {user.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {order?.createdAt
                            ? new Date(order.createdAt).toLocaleString()
                            : "Date unavailable"}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {/* Payment */}
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                            isPaid
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {isPaid ? "✓ Paid" : "Unpaid"}
                        </span>

                        {/* Order Status */}
                        <span className="rounded-full bg-orange-100 px-3 py-1.5 text-xs font-bold capitalize text-orange-600">
                          {order?.orderStatus || "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="p-4 sm:p-6">
                    <p className="mb-3 text-sm font-bold text-gray-700">
                      Products
                    </p>

                    <div className="space-y-3">
                      {Array.isArray(order?.cartItems) &&
                      order.cartItems.length > 0 ? (
                        order.cartItems.map((item, productIndex) => {
                          const product = item?.product;

                          return (
                            <div
                              key={item?._id || product?._id || productIndex}
                              className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 sm:gap-4"
                            >
                              {/* Image */}
                              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white sm:h-24 sm:w-24">
                                {product?.image ? (
                                  <img
                                    src={`http://localhost:2000/uploads/${product.image}`}
                                    alt={product?.name || "Product"}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                    No Image
                                  </div>
                                )}
                              </div>

                              {/* Product Info */}
                              <div className="min-w-0 flex-1">
                                <h3 className="truncate text-sm font-bold text-gray-800 sm:text-base">
                                  {product?.name || "Product"}
                                </h3>

                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500 sm:text-sm">
                                  {product?.description ||
                                    "No description available."}
                                </p>

                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                  <span className="text-sm font-bold text-orange-600">
                                    Rs.{" "}
                                    {Number(
                                      product?.price || 0,
                                    ).toLocaleString()}
                                  </span>

                                  <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-bold text-orange-600">
                                    × {item?.cartQuantity || 1}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="rounded-xl bg-gray-50 p-4 text-center text-sm text-gray-400">
                          No products found for this order.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="border-t border-gray-100 bg-gray-50 px-4 py-4 sm:px-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="font-medium">Payment:</span>

                        <span
                          className={`font-bold ${
                            isPaid ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {isPaid ? "Payment Paid ✓" : "Payment Pending"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-5 sm:justify-end">
                        <span className="text-sm font-semibold text-gray-500">
                          Total
                        </span>

                        <span className="text-xl font-extrabold text-orange-600">
                          Rs. {Number(order?.totalPrice || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="font-extrabold text-9xl text-black">
          404 Page Not Found
        </div>
      )}
    </div>
  );
}
