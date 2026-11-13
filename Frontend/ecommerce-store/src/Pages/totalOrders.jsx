import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteOrder, totalOrder } from "../Thunks/stripeThunk";
import { Link, useNavigate } from "react-router-dom";

import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Download,
  CalendarDays,
  CheckCheck,
  CreditCard,
  CircleAlert,
  Plus,
} from "lucide-react";
import { BsBorderStyle } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { RiDeleteBinLine } from "react-icons/ri";

export default function TotalOrders() {
  const orders = useSelector((state) => state.totalOrders.totalOrder);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [plusorder, setPlusOrder] = useState([]);
  const [openPlus, setOpenPlus] = useState(false);
  const [deleteBtn, setDeleteBtn] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    dispatch(totalOrder());
  }, [dispatch]);

  // ----------------------------------
  // SUMMARY COUNTS
  // ----------------------------------

  const pendingPayment = useMemo(() => {
    return (
      orders?.filter(
        (order) =>
          order?.paymentStatus === "unpaid" ||
          order?.paymentStatus === "pending",
      ).length || 0
    );
  }, [orders]);

  const completedOrders = useMemo(() => {
    return (
      orders?.filter(
        (order) =>
          order?.paymentStatus === "paid" || order?.orderStatus === "confirmed",
      ).length || 0
    );
  }, [orders]);

  const refundedOrders = useMemo(() => {
    return (
      orders?.filter((order) => order?.paymentStatus === "refunded").length || 0
    );
  }, [orders]);

  const failedOrders = useMemo(() => {
    return (
      orders?.filter(
        (order) =>
          order?.paymentStatus === "failed" ||
          order?.orderStatus === "cancelled",
      ).length || 0
    );
  }, [orders]);

  // ----------------------------------
  // SEARCH
  // ----------------------------------

  const filteredOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];

    const value = search.toLowerCase().trim();

    if (!value) return orders;

    return orders.filter((order) => {
      const orderId = order?._id?.toLowerCase() || "";
      const customerName = order?.user?.name?.toLowerCase() || "";
      const customerEmail = order?.user?.email?.toLowerCase() || "";
      const payment = order?.paymentStatus?.toLowerCase() || "";
      const status = order?.orderStatus?.toLowerCase() || "";

      return (
        orderId.includes(value) ||
        customerName.includes(value) ||
        customerEmail.includes(value) ||
        payment.includes(value) ||
        status.includes(value)
      );
    });
  }, [orders, search]);

  // ----------------------------------
  // PAGINATION
  // ----------------------------------

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;

    return filteredOrders.slice(start, start + rowsPerPage);
  }, [filteredOrders, currentPage, rowsPerPage]);

  // ----------------------------------
  // DATE FORMAT
  // ----------------------------------

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // ----------------------------------
  // ORDER NUMBER
  // ----------------------------------

  const getOrderNumber = (order, index) => {
    if (order?._id) {
      return `#${order._id.slice(-4).toUpperCase()}`;
    }

    return `#${String(index + 1).padStart(4, "0")}`;
  };

  // ----------------------------------
  // CUSTOMER INITIALS
  // ----------------------------------

  const getInitials = (name) => {
    if (!name) return "CU";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // ----------------------------------
  // PAYMENT STATUS
  // ----------------------------------

  const getPaymentStyle = (status) => {
    switch (status) {
      case "paid":
        return {
          text: "Paid",
          dot: "bg-green-500",
          textColor: "text-green-600",
        };

      case "failed":
        return {
          text: "Failed",
          dot: "bg-red-500",
          textColor: "text-red-500",
        };

      case "refunded":
        return {
          text: "Refunded",
          dot: "bg-blue-500",
          textColor: "text-blue-600",
        };

      case "cancelled":
        return {
          text: "Cancelled",
          dot: "bg-slate-400",
          textColor: "text-slate-500",
        };

      default:
        return {
          text: "Pending",
          dot: "bg-orange-400",
          textColor: "text-orange-500",
        };
    }
  };

  // ----------------------------------
  // EXPORT
  // ----------------------------------

  const handleExport = () => {
    if (!filteredOrders.length) return;

    const csvRows = [];

    csvRows.push([
      "Order",
      "Date",
      "Customer",
      "Email",
      "Total",
      "Payment",
      "Status",
    ]);

    filteredOrders.forEach((order, index) => {
      csvRows.push([
        getOrderNumber(order, index),
        formatDate(order?.createdAt),
        order?.user?.name || "Unknown",
        order?.user?.email || "",
        order?.totalPrice || 0,
        order?.paymentStatus || "",
        order?.orderStatus || "",
      ]);
    });

    const csvContent = csvRows
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "orders.csv";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ----------------------------------
  // CHANGE PAGE
  // ----------------------------------

  const changeRowsPerPage = (value) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handlePlusBtn = async (order) => {
    setOpenPlus(true);
    setPlusOrder(order);
  };

  const handleDeleteOrder = async (id) => {
    try {
      await dispatch(deleteOrder({ id })).unwrap();
    } catch (error) {
      console.error("DELETE ORDER ERROR:", error);
      alert(error?.message || "Failed to delete order.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] lg:ml-[250px]">
      {openPlus && (
        <div
          className="
      absolute
      left-1/2
      -translate-x-1/2
      bottom-22
      z-[200]
      w-[calc(100vw-24px)]
      max-w-[440px]
      rounded-xl
      bg-white
      shadow-2xl
      overflow-hidden
    "
        >
          <table className="w-full border-collapse">
            <tbody>
              {/* Header */}
              <tr>
                <td colSpan="2" className="px-4 sm:px-5 pt-4 sm:pt-5 pb-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-lg sm:text-xl text-[#516377] font-sans">
                        Order Details
                      </p>

                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {plusorder?.user?.name}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="
                  shrink-0
                  p-2
                  bg-gray-300
                  text-gray-500
                  rounded-md
                  cursor-pointer
                  hover:bg-gray-400
                  transition
                "
                      onClick={() => setOpenPlus(false)}
                    >
                      <RxCross2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>

              {/* Order ID */}
              <tr className="border-t border-gray-200">
                <td className="px-4 sm:px-5 py-3 text-xs sm:text-sm font-semibold text-gray-500 whitespace-nowrap">
                  Order ID
                </td>

                <td className="px-4 sm:px-5 py-3 text-xs sm:text-sm font-medium text-gray-800 text-right break-all">
                  {plusorder?._id}
                </td>
              </tr>

              {/* Customer */}
              <tr className="border-t border-gray-100">
                <td className="px-4 sm:px-5 py-3 text-xs sm:text-sm font-semibold text-gray-500">
                  Customer
                </td>

                <td className="px-4 sm:px-5 py-3 text-xs sm:text-sm font-semibold text-[#516377] text-right">
                  {plusorder?.user?.name}
                </td>
              </tr>

              {/* Username */}
              <tr className="border-t border-gray-100">
                <td className="px-4 sm:px-5 py-3 text-xs sm:text-sm font-semibold text-gray-500">
                  Username
                </td>

                <td className="px-4 sm:px-5 py-3 text-xs sm:text-sm text-gray-700 text-right">
                  @{plusorder?.user?.username}
                </td>
              </tr>

              {/* Email */}
              <tr className="border-t border-gray-100">
                <td className="px-4 sm:px-5 py-3 text-xs sm:text-sm font-semibold text-gray-500">
                  Email
                </td>

                <td className="px-4 sm:px-5 py-3 text-xs sm:text-sm text-gray-700 text-right break-all">
                  {plusorder?.user?.email}
                </td>
              </tr>

              {/* Order Status */}
              <tr className="border-t border-gray-100">
                <td className="px-4 sm:px-5 py-3 text-xs sm:text-sm font-semibold text-gray-500">
                  Order Status
                </td>

                <td className="px-4 sm:px-5 py-3 text-right">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {plusorder?.orderStatus}
                  </span>
                </td>
              </tr>

              {/* Total */}
              <tr className="border-t border-gray-200">
                <td className="px-4 sm:px-5 py-4 text-sm font-bold text-gray-600">
                  Total
                </td>

                <td className="px-4 sm:px-5 py-4 text-right font-bold text-lg text-[#516377]">
                  Rs. {plusorder?.totalPrice?.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="px-4 py-5 sm:px-6 lg:px-8">
        {/* =========================================
            BREADCRUMB
        ========================================= */}

        <div className="mb-6 flex items-center gap-2 text-sm">
          <span className="text-gray-400">eCommerce</span>

          <span className="text-gray-300">/</span>

          <span className="font-semibold text-[#566a7f]">Order List</span>
        </div>

        {/* =========================================
            SUMMARY CARD
        ========================================= */}

        <div className="mb-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {/* Pending */}

            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <p className="text-[28px] font-bold leading-none text-[#566a7f]">
                  {orders.length}
                </p>

                <p className="mt-2 text-sm font-medium text-[#697a8d]">
                  Total Orders
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#eef2f6] text-[#71869b]">
                <BsBorderStyle />
              </div>
            </div>
            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <p className="text-[28px] font-bold leading-none text-[#566a7f]">
                  {pendingPayment}
                </p>

                <p className="mt-2 text-sm font-medium text-[#697a8d]">
                  Pending Payment
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#eef2f6] text-[#71869b]">
                <CalendarDays size={23} strokeWidth={1.8} />
              </div>
            </div>

            {/* Completed */}

            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <p className="text-[28px] font-bold leading-none text-[#566a7f]">
                  {completedOrders}
                </p>

                <p className="mt-2 text-sm font-medium text-[#697a8d]">
                  Completed
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#eef2f6] text-[#71869b]">
                <CheckCheck size={24} strokeWidth={1.8} />
              </div>
            </div>

            {/* Failed */}

            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <p className="text-[28px] font-bold leading-none text-[#566a7f]">
                  {failedOrders}
                </p>

                <p className="mt-2 text-sm font-medium text-[#697a8d]">
                  Failed
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#eef2f6] text-[#71869b]">
                <CircleAlert size={23} strokeWidth={1.8} />
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            ORDER TABLE CARD
        ========================================= */}

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          {/* TOP CONTROLS */}

          <div className="flex flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}

            <div className="relative w-full sm:w-[260px]">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search Order"
                className="h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              />
            </div>

            {/* Right Controls */}

            <div className="flex items-center gap-3">
              {/* Rows */}

              <div className="relative">
                <select
                  value={rowsPerPage}
                  onChange={(e) => changeRowsPerPage(e.target.value)}
                  className="h-10 appearance-none rounded-md border border-gray-200 bg-white pl-4 pr-9 text-sm font-medium text-[#697a8d] outline-none focus:border-blue-400"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              {/* Export */}

              <button
                onClick={handleExport}
                className="flex h-10 items-center gap-2 rounded-md bg-[#eef1f4] px-4 text-sm font-medium text-[#697a8d] transition hover:bg-gray-200"
              >
                <Download size={17} />

                <span className="hidden sm:block">Export</span>

                <ChevronDown size={15} />
              </button>
            </div>
          </div>

          {/* =========================================
              TABLE
          ========================================= */}

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse">
              <thead>
                <tr className="border-y border-gray-200">
                  {/* Plus */}

                  <th className="w-[55px] px-3 py-2"></th>

                  {/* Checkbox */}

                  <th className="w-[55px]">
                    <input className="h-4 w-4 " />
                  </th>

                  {/* Order */}

                  <th className="px-4 py-4 text-left">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#566a7f]">
                      Order
                      <div className="flex flex-col">
                        <ChevronUp size={13} className="text-gray-400" />

                        <ChevronDown
                          size={13}
                          className="-mt-1 text-gray-400"
                        />
                      </div>
                    </div>
                  </th>

                  {/* Date */}

                  <th className="px-4 py-4 text-left">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#566a7f]">
                      Date
                      <div className="flex flex-col">
                        <ChevronUp size={13} className="text-gray-400" />

                        <ChevronDown
                          size={13}
                          className="-mt-1 text-gray-400"
                        />
                      </div>
                    </div>
                  </th>

                  {/* Customer */}

                  <th className="px-4 py-4 text-left">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#566a7f]">
                      Customers
                      <div className="flex flex-col">
                        <ChevronUp size={13} className="text-gray-400" />

                        <ChevronDown
                          size={13}
                          className="-mt-1 text-gray-400"
                        />
                      </div>
                    </div>
                  </th>

                  {/* Payment */}

                  <th className="px-4 py-4 text-left">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#566a7f]">
                      Payment
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order, index) => {
                    const payment = getPaymentStyle(order?.paymentStatus);

                    const customerName =
                      order?.user?.name || "Unknown Customer";

                    const customerEmail = order?.user?.email || "No email";

                    return (
                      <tr
                        key={order?._id || `${currentPage}-${index}`}
                        className="group border-b border-gray-200 transition hover:bg-gray-50"
                      >
                        {/* Plus */}

                        <td className="px-3 py-3">
                          <button
                            className="flex h-5 w-5 items-center justify-center rounded-full border border-blue-300 text-blue-500 transition hover:bg-blue-500 hover:text-white"
                            onClick={() => handlePlusBtn(order)}
                          >
                            <Plus size={13} />
                          </button>
                        </td>

                        {/* Delete Order */}

                        <td className="px-3 py-3 text-red-500 hover:text-red-600">
                          <button onClick={() => handleDeleteOrder(order._id)}>
                            <RiDeleteBinLine />
                          </button>
                        </td>

                        {/* Order */}

                        <td
                          className="px-4 py-3"
                          onClick={() =>
                            navigate(`/orderDetails/${order?._id}`)
                          }
                        >
                          <button className="font-semibold text-[#5a8dee] hover:text-blue-600">
                            {getOrderNumber(order, index)}
                          </button>
                        </td>

                        {/* Date */}

                        <td
                          className="whitespace-nowrap px-4 py-3"
                          onClick={() =>
                            navigate(`/orderDetails/${order?._id}`)
                          }
                        >
                          <span className="text-sm text-[#677788]">
                            {formatDate(order?.createdAt)}
                          </span>
                        </td>

                        {/* Customer */}

                        <td className="px-4 py-3">
                          <div
                            className="flex items-center gap-3"
                            onClick={() =>
                              navigate(`/orderDetails/${order?._id}`)
                            }
                          >
                            {/* Avatar */}

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e2f7f7]  text-sm font-bold text-[#20a8a8]">
                              {getInitials(customerName)}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-[0.9375rem] font-[Rubik Times New Roman serif] font-[500] leading-[1.1] text-[#677788]">
                                {customerName}
                              </p>

                              <p className="max-w-[220px] truncate text-xs text-gray-400">
                                {customerEmail}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Payment */}

                        <td
                          className="px-4 py-3"
                          onClick={() =>
                            navigate(`/orderDetails/${order?._id}`)
                          }
                        >
                          <div
                            className={`flex items-center gap-2 text-sm font-semibold ${payment.textColor}`}
                          >
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${payment.dot}`}
                            />

                            {payment.text}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                        📦
                      </div>

                      <h3 className="mt-4 text-base font-semibold text-[#566a7f]">
                        No Orders Found
                      </h3>

                      <p className="mt-1 text-sm text-gray-400">
                        Try changing your search.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* =========================================
              FOOTER / PAGINATION
          ========================================= */}

          <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#697a8d]">
              Showing{" "}
              {filteredOrders.length === 0
                ? 0
                : (currentPage - 1) * rowsPerPage + 1}{" "}
              to {Math.min(currentPage * rowsPerPage, filteredOrders.length)} of{" "}
              {filteredOrders.length} orders
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={17} />
              </button>

              <span className="flex h-8 min-w-8 items-center justify-center rounded-md bg-blue-500 px-2 text-sm font-medium text-white">
                {currentPage}
              </span>

              <button
                disabled={currentPage >= totalPages || totalPages === 0}
                onClick={() =>
                  setCurrentPage((page) => Math.min(page + 1, totalPages))
                }
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
