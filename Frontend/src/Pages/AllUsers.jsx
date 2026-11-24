import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../Thunks/userThunk";
import { getUserOrders } from "../Thunks/stripeThunk";
import { getProductImageUrl } from "../utils/productImage";

export default function AllUsers() {
  const { data, pending, error } = useSelector((state) => state.getUser);

  const { orders } = useSelector((state) => state.getOrders);

  const dispatch = useDispatch();

  const [selectedUser, setSelectedUser] = useState(null);
  const [showOrders, setShowOrders] = useState(false);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const users = Array.isArray(data) ? data : [];
  const selectedUserOrders = Array.isArray(orders) ? orders : [];

  const handleOrders = (user) => {
    dispatch(getUserOrders({ id: user._id }));
    setSelectedUser(user);
    setShowOrders(true);
  };

  const closeOrders = () => {
    setShowOrders(false);

    setTimeout(() => {
      setSelectedUser(null);
    }, 300);
  };

  if (pending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-7xl rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <h2 className="text-lg font-bold text-red-600">
            Failed to load users
          </h2>

          <p className="mt-1 text-sm text-red-500">
            Something went wrong while fetching users.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ================================================= */}
      {/* MAIN PAGE */}
      {/* ================================================= */}

      <div className="min-h-screen bg-slate-50 px-3 py-5 sm:px-5 lg:ml-64 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* ============================================= */}
          {/* HEADER */}
          {/* ============================================= */}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Users
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage users and view their orders.
              </p>
            </div>

            <div className="w-full rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-gray-100 sm:w-auto">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Total Users
              </p>

              <p className="mt-1 text-2xl font-bold text-orange-500">
                {users.length}
              </p>
            </div>
          </div>

          {/* ============================================= */}
          {/* USERS */}
          {/* ============================================= */}

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            {users.length > 0 ? (
              <>
                {/* ======================================= */}
                {/* DESKTOP TABLE */}
                {/* ======================================= */}

                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full text-left">
                    <thead className="border-b bg-gray-50">
                      <tr>
                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                          User
                        </th>

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                          Username
                        </th>

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                          Email
                        </th>

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                          Role
                        </th>

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                          Verification
                        </th>

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                          Orders
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {users.map((user) => {
                        const orderCount = user?.orderCount || 0;

                        return (
                          <tr
                            key={user?._id}
                            className="transition hover:bg-gray-50"
                          >
                            {/* USER */}

                            <td className=" py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full ms-2 bg-orange-100 text-sm font-bold text-orange-600">
                                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                </div>

                                <div className="min-w-0">
                                  <p className="max-w-[180px] truncate font-semibold text-gray-900">
                                    {user?.name || "N/A"}
                                  </p>

                                  <p className="max-w-[180px] truncate text-xs text-gray-400">
                                    ID: {user?._id || "N/A"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* USERNAME */}

                            <td className="px-5 py-4">
                              <span className="text-sm font-medium text-gray-700">
                                {user?.username || "N/A"}
                              </span>
                            </td>

                            {/* EMAIL */}

                            <td className="px-5 py-4">
                              <span className="text-sm text-gray-700">
                                {user?.email || "N/A"}
                              </span>
                            </td>

                            {/* ROLE */}

                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                                  user?.role === "Admin"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {user?.role || "User"}
                              </span>
                            </td>

                            {/* VERIFICATION */}

                            <td className="px-5 py-4">
                              {user?.emailVerified ? (
                                <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                                  ✓ Verified
                                </span>
                              ) : (
                                <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
                                  ! Not Verified
                                </span>
                              )}
                            </td>

                            {/* ORDERS */}

                            <td className="px-5 py-4">
                              <button
                                type="button"
                                onClick={() => handleOrders(user)}
                                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 active:scale-95"
                              >
                                <span>📦</span>
                                Orders
                                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                                  {orderCount}
                                </span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* ======================================= */}
                {/* SMALL + MEDIUM CARDS */}
                {/* ======================================= */}

                <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:hidden">
                  {users.map((user) => {
                    return (
                      <div
                        key={user?._id}
                        className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
                      >
                        {/* USER */}

                        <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-bold text-gray-900">
                              {user?.name || "N/A"}
                            </p>

                            <p className="truncate text-xs text-gray-400">
                              ID: {user?._id || "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* USERNAME */}

                        <div className="flex items-center justify-between border-b border-gray-100 py-3">
                          <span className="text-sm font-medium text-gray-400">
                            Username
                          </span>

                          <span className="max-w-[55%] truncate text-sm font-semibold text-gray-700">
                            {user?.username || "N/A"}
                          </span>
                        </div>

                        {/* EMAIL */}

                        <div className="flex items-center justify-between border-b border-gray-100 py-3">
                          <span className="text-sm font-medium text-gray-400">
                            Email
                          </span>

                          <span className="max-w-[55%] truncate text-sm font-semibold text-gray-700">
                            {user?.email || "N/A"}
                          </span>
                        </div>

                        {/* ROLE */}

                        <div className="flex items-center justify-between border-b border-gray-100 py-3">
                          <span className="text-sm font-medium text-gray-400">
                            Role
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              user?.role === "Admin"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {user?.role || "User"}
                          </span>
                        </div>

                        {/* VERIFICATION */}

                        <div className="flex items-center justify-between border-b border-gray-100 py-3">
                          <span className="text-sm font-medium text-gray-400">
                            Verification
                          </span>

                          {user?.emailVerified ? (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                              ✓ Verified
                            </span>
                          ) : (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
                              ! Not Verified
                            </span>
                          )}
                        </div>

                        {/* ORDERS */}

                        <div className="flex items-center justify-between border-b border-gray-100 py-3">
                          <span className="text-sm font-medium text-gray-400">
                            Orders
                          </span>

                          <button
                            type="button"
                            onClick={() => handleOrders(user)}
                            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-orange-600 active:scale-95"
                          >
                            📦 Orders
                            <span className="rounded-full bg-white/20 px-2 py-0.5">
                              {user.orderCount}
                            </span>
                          </button>
                        </div>

                        {/* JOINED */}

                        <div className="flex items-center justify-between pt-3">
                          <span className="text-sm font-medium text-gray-400">
                            Joined
                          </span>

                          <span className="text-sm font-semibold text-gray-700">
                            {user?.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* ========================================= */
              /* NO USERS */
              /* ========================================= */

              <div className="flex min-h-[350px] flex-col items-center justify-center px-5 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                  👤
                </div>

                <h2 className="text-lg font-bold text-gray-800">
                  No Users Found
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  There are currently no registered users.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BACKDROP */}
      {showOrders && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
          onClick={closeOrders}
        />
      )}

      {/* ORDERS SIDEBAR */}
      <aside
        className={`fixed right-0 top-0 z-[60] flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          showOrders ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* SIDEBAR HEADER */}
        <div className="flex items-center justify-between border-b px-5 py-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600">
              {selectedUser?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-gray-900">
                {selectedUser?.name || "User"}
              </h2>

              <p className="truncate text-xs text-gray-500">
                {selectedUser?.email || ""}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeOrders}
            className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 pb-1 text-xl text-gray-600 transition hover:bg-gray-200 hover:text-gray-900"
          >
            ×
          </button>
        </div>

        {/* ORDER SUMMARY */}
        <div className="grid grid-cols-3 gap-2 border-b bg-gray-50 p-4">
          {/* ORDERS */}

          <div className="rounded-xl bg-white p-3 text-center shadow-sm">
            <p className="text-xs text-gray-500">Orders</p>

            <p className="mt-1 text-lg font-bold text-gray-900">
              {selectedUserOrders.length}
            </p>
          </div>

          {/* PAID */}

          <div className="rounded-xl bg-white p-3 text-center shadow-sm">
            <p className="text-xs text-gray-500">Paid</p>

            <p className="mt-1 text-lg font-bold text-green-600">
              {
                selectedUserOrders.filter(
                  (order) =>
                    order?.paymentStatus === "paid" ||
                    order?.status === "paid" ||
                    order?.paid === true ||
                    order?.isPaid === true,
                ).length
              }
            </p>
          </div>

          {/* UNPAID */}

          <div className="rounded-xl bg-white p-3 text-center shadow-sm">
            <p className="text-xs text-gray-500">Unpaid</p>

            <p className="mt-1 text-lg font-bold text-red-500">
              {
                selectedUserOrders.filter(
                  (order) =>
                    !(
                      order?.paymentStatus === "paid" ||
                      order?.status === "paid" ||
                      order?.paid === true ||
                      order?.isPaid === true
                    ),
                ).length
              }
            </p>
          </div>
        </div>

        {/* =============================================== */}
        {/* ORDERS LIST */}
        {/* =============================================== */}

        <div className="flex-1 overflow-y-auto p-4">
          {selectedUserOrders.length > 0 ? (
            <div className="space-y-4">
              {selectedUserOrders.map((order, index) => {
                const isPaid =
                  order?.paymentStatus === "paid" ||
                  order?.status === "paid" ||
                  order?.paid === true ||
                  order?.isPaid === true;

                return (
                  <div
                    key={order?._id || index}
                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    {/* ORDER TOP */}

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Order #{index + 1}
                        </p>

                        {order?._id && (
                          <p className="mt-1 break-all text-[11px] text-gray-400">
                            {order._id}
                          </p>
                        )}
                      </div>

                      {/* PAYMENT */}

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          isPaid
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </div>

                    {/* ORDER DETAILS */}

                    <div className="mt-4 space-y-3">
                      {/* TOTAL AMOUNT */}
                      {order?.totalAmount !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            Total Amount
                          </span>

                          <span className="font-bold text-gray-900">
                            Rs. {Number(order.totalAmount).toLocaleString()}
                          </span>
                        </div>
                      )}
                      {/* ALTERNATIVE AMOUNT */}
                      {order?.amount !== undefined &&
                        order?.totalAmount === undefined && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              Amount
                            </span>

                            <span className="font-bold text-gray-900">
                              Rs. {Number(order.amount).toLocaleString()}
                            </span>
                          </div>
                        )}
                      {/* STATUS */}
                      {order?.status && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Status</span>

                          <span className="text-sm font-semibold capitalize text-gray-700">
                            {order.status}
                          </span>
                        </div>
                      )}
                      {/* DATE */}
                      {order?.createdAt && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Date</span>

                          <span className="text-sm font-medium text-gray-700">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {/* PRODUCTS */}
                      {Array.isArray(order?.cartItems) &&
                        order.cartItems.length > 0 && (
                          <div className="border-t pt-3">
                            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
                              Products
                            </p>

                            <div className="space-y-2">
                              {order.cartItems.map((item, productIndex) => {
                                const product = item?.product;
                                const unitPrice =
                                  Number(item?.unitPrice ?? product?.price) || 0;

                                return (
                                  <div
                                    key={
                                      item?._id || product?._id || productIndex
                                    }
                                    className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2"
                                  >
                                    {/* Product Image */}
                                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
                                      {product?.image ? (
                                        <img
                                          src={getProductImageUrl(product.image)}
                                          alt={product?.name || "Product"}
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                          No Image
                                        </div>
                                      )}
                                    </div>

                                    {/* Product Name */}
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-sm font-semibold text-gray-700">
                                        {product?.name ||
                                          `Product ${productIndex + 1}`}
                                      </p>

                                      <p className="mt-1 text-xs text-gray-400">
                                        Rs. {unitPrice.toLocaleString()} each
                                      </p>
                                    </div>

                                    {/* Quantity */}
                                    <span className="shrink-0 rounded-full bg-orange-100 px-2 py-1 text-xs font-bold text-orange-600">
                                      × {item?.cartQuantity}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* =========================================== */
            /* NO ORDERS */
            /* =========================================== */

            <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                📦
              </div>

              <h3 className="text-lg font-bold text-gray-800">No Orders Yet</h3>

              <p className="mt-1 max-w-[260px] text-sm text-gray-500">
                {selectedUser?.name
                  ? `${selectedUser.name} hasn't placed any orders yet.`
                  : "This user hasn't placed any orders yet."}
              </p>
            </div>
          )}
        </div>

        {/* =============================================== */}
        {/* SIDEBAR FOOTER */}
        {/* =============================================== */}

        <div className="border-t bg-gray-50 p-4">
          <button
            type="button"
            onClick={closeOrders}
            className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
          >
            Close Orders
          </button>
        </div>
      </aside>
    </>
  );
}
