import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { deleteOrder, specificOrder } from "../Thunks/stripeThunk";
import { getProductImageUrl } from "../utils/productImage";

import {
  ArrowLeft,
  CheckCheck,
  Clock3,
  CreditCard,
  MapPin,
  Mail,
  Phone,
  Package,
  Trash2,
  User,
  Pencil,
} from "lucide-react";

export default function OrderDetails() {
  const { id } = useParams();

  const order = useSelector((state) => state.specificOrder.order);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(specificOrder({ id }));
  }, [dispatch, id]);

  console.log("Orderrrrr", order);

  // ------------------------------------------
  // DATA
  // ------------------------------------------

  const paymentStatus = order?.paymentStatus || "unpaid";

  const orderStatus = order?.orderStatus || "pending";

  const customerName = order?.user?.name || "Unknown Customer";

  const customerEmail = order?.user?.email || "No email";

  const customerUsername = order?.user?.username || "N/A";

  const products = Array.isArray(order?.cartItems) ? order.cartItems : [];

  const totalProducts = products.length;

  // ------------------------------------------
  // DATE
  // ------------------------------------------

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // ------------------------------------------
  // CUSTOMER INITIALS
  // ------------------------------------------

  const initials = customerName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // ------------------------------------------
  // STATUS
  // ------------------------------------------

  const isPaid = paymentStatus === "paid";

  const isConfirmed = orderStatus === "confirmed";

  // ------------------------------------------
  // SHIPPING ADDRESS
  // ------------------------------------------

  const shippingAddress =
    order?.shippingAddress || order?.address || order?.user?.address;

  // ------------------------------------------
  // DELETE
  // ------------------------------------------

  const handleDeleteOrder = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?",
    );

    if (!confirmDelete) return;

    try {
      await dispatch(deleteOrder({ id: order._id })).unwrap();
      navigate("/orders");
    } catch (error) {
      console.error("DELETE ORDER ERROR:", error);
      alert(error?.message || "Failed to delete order.");
    }
  };

  if (!order) {
    return (
      <div className="lg:ml-[250px] flex min-h-screen items-center justify-center bg-[#f5f6f8]">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow">
            <Package size={22} className="text-gray-400" />
          </div>

          <p className="mt-3 text-sm text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:ml-[250px] h-screen overflow-hidden bg-[#f5f6f8]">
      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div className="h-full px-4 py-4 sm:px-6 lg:px-7">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* LEFT */}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-[#566a7f] sm:text-2xl">
                Order #{order?._id?.slice(-5)?.toUpperCase()}
              </h1>

              {/* PAYMENT */}

              <span
                className={`rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                  isPaid
                    ? "bg-emerald-100 text-emerald-500"
                    : "bg-orange-100 text-orange-500"
                }`}
              >
                {isPaid ? "Paid" : paymentStatus}
              </span>

              {/* ORDER STATUS */}

              <span
                className={`rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                  isConfirmed
                    ? "bg-cyan-100 text-cyan-500"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {isConfirmed ? "Ready to Pickup" : orderStatus}
              </span>
            </div>

            <p className="mt-1 text-sm text-[#697a8d]">
              {formatDate(order?.createdAt)}
            </p>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="flex h-9 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-[#697a8d] transition hover:bg-gray-50"
            >
              <ArrowLeft size={16} />

              <span className="hidden sm:block">Back</span>
            </button>

            <button
              onClick={handleDeleteOrder}
              className="flex h-9 items-center gap-2 rounded-md bg-red-50 px-4 cursor-pointer text-sm font-medium text-red-500 transition  hover:bg-red-100"
            >
              <Trash2 size={16} className="cursor-pointer" />git 

              <span>Delete Order</span>
            </button>
          </div>
        </div>

        {/* =====================================================
            MAIN GRID
        ====================================================== */}

        <div className="grid h-[calc(100vh-125px)] min-h-0 grid-cols-1 gap-5 lg:grid-cols-12">
          {/* =================================================
              LEFT - ORDER DETAILS
          ================================================== */}

          <div className="min-h-0 lg:col-span-8">
            <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
              {/* CARD HEADER */}

              <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4">
                <h2 className="text-lg font-bold text-[#566a7f]">
                  Order details
                </h2>

                <button className="flex items-center gap-1 text-sm font-semibold text-blue-500 hover:text-blue-600">
                  <Pencil size={15} />
                  Edit
                </button>
              </div>

              {/* =================================================
                  PRODUCT TABLE HEADER
              ================================================== */}

              <div className="grid shrink-0 grid-cols-[45px_minmax(0,1fr)_100px_70px_110px] items-center border-b border-gray-200 px-5 py-3">
                <div>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 accent-blue-500"
                  />
                </div>

                <div className="text-xs font-bold uppercase tracking-wider text-[#566a7f]">
                  Products
                </div>

                <div className="text-xs font-bold uppercase tracking-wider text-[#566a7f]">
                  Price
                </div>

                <div className="text-xs font-bold uppercase tracking-wider text-[#566a7f]">
                  Qty
                </div>

                <div className="text-right text-xs font-bold uppercase tracking-wider text-[#566a7f]">
                  Total
                </div>
              </div>

              {/* =================================================
                  PRODUCTS
              ================================================== */}

              <div className="min-h-0 flex-1 overflow-hidden">
                {products.length > 0 ? (
                  products.map((item, index) => {
                    const product = item?.product;

                    const quantity = Number(item?.cartQuantity) || 0;

                    const price = Number(product?.price) || 0;

                    const itemTotal = price * quantity;

                    return (
                      <div
                        key={item?._id || `${order?._id}-${index}`}
                        className="grid grid-cols-[45px_minmax(0,1fr)_100px_70px_110px] items-center border-b border-gray-200 px-5 py-3 transition hover:bg-gray-50"
                      >
                        {/* CHECKBOX */}

                        <div>
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 accent-blue-500"
                          />
                        </div>

                        {/* PRODUCT */}

                        <div className="flex min-w-0 items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
                            {product?.image ? (
                              <img
                                src={getProductImageUrl(product.image)}
                                alt={product?.name || "Product"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Package size={20} className="text-gray-400" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-[#566a7f]">
                              {product?.name || "Product unavailable"}
                            </p>

                            <p className="truncate text-xs text-gray-400">
                              {product?.description
                                ? product.description.slice(0, 30)
                                : "Product details"}
                            </p>
                          </div>
                        </div>

                        {/* PRICE */}

                        <div className="text-sm text-[#697a8d]">
                          Rs. {price.toLocaleString()}
                        </div>

                        {/* QTY */}

                        <div className="text-sm text-[#697a8d]">{quantity}</div>

                        {/* TOTAL */}

                        <div className="text-right text-sm font-bold text-[#566a7f]">
                          Rs. {itemTotal.toLocaleString()}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <Package size={30} className="mx-auto text-gray-300" />

                      <p className="mt-2 text-sm text-gray-400">
                        No products found
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* =================================================
                  ORDER TOTAL
              ================================================== */}

              <div className="shrink-0 border-t border-gray-200 px-5 py-4">
                <div className="ml-auto w-full max-w-[300px] space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#697a8d]">Subtotal:</span>

                    <span className="font-semibold text-[#566a7f]">
                      Rs.{" "}
                      {products
                        .reduce(
                          (total, item) =>
                            total +
                            (Number(item?.product?.price) || 0) *
                              (Number(item?.cartQuantity) || 0),
                          0,
                        )
                        .toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-[#697a8d]">Discount:</span>

                    <span className="font-semibold text-[#566a7f]">Rs. 0</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-[#697a8d]">Delivery:</span>

                    <span className="font-semibold text-[#566a7f]">
                      Rs. 200
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-gray-100 pt-2">
                    <span className="text-base font-bold text-[#566a7f]">
                      Total:
                    </span>

                    <span className="text-lg font-bold text-[#566a7f]">
                      Rs. {Number(order?.totalPrice || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================== */}

          <div className="min-h-0 space-y-5 lg:col-span-4">
            {/* =================================================
                CUSTOMER DETAILS
            ================================================== */}

            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#566a7f]">
                  Customer details
                </h2>
              </div>

              {/* CUSTOMER */}

              <div className="flex items-center gap-3">
                {order?.user?.image ? (
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
                    <img
                      src={getProductImageUrl(order.user.image)}
                      alt={customerName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-500">
                    {initials}
                  </div>
                )}

                <div className="min-w-0">
                  <h3 className="truncate font-bold text-[#566a7f]">
                    {customerName}
                  </h3>

                  <p className="truncate text-xs text-gray-400">
                    @{customerUsername}
                  </p>
                </div>
              </div>

              {/* ORDER COUNT */}

              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50">
                  <Package size={22} className="text-emerald-500" />
                </div>

                <div>
                  <p className="font-bold text-[#566a7f]">
                    {totalProducts}{" "}
                    {totalProducts === 1 ? "Product" : "Products"}
                  </p>

                  <p className="text-xs text-gray-400">In this order</p>
                </div>
              </div>

              {/* CONTACT */}

              <div className="mt-5 border-t border-gray-100 pt-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-bold text-[#566a7f]">Contact info</h3>

                  <button className="text-sm font-semibold text-blue-500">
                    Edit
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail size={17} className="mt-0.5 shrink-0 text-gray-400" />

                    <p className="break-all text-sm text-[#697a8d]">
                      {customerEmail}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone size={17} className="shrink-0 text-gray-400" />

                    <p className="text-sm text-[#697a8d]">
                      {order?.user?.phone || "Phone not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                SHIPPING ADDRESS
            ================================================== */}

            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#566a7f]">
                  Shipping address
                </h2>

                <button className="text-sm font-semibold text-blue-500">
                  Edit
                </button>
              </div>

              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
                  <MapPin size={20} className="text-blue-500" />
                </div>

                <div>
                  {shippingAddress ? (
                    <p className="whitespace-pre-line text-sm leading-6 text-[#697a8d]">
                      {typeof shippingAddress === "string"
                        ? shippingAddress
                        : [
                            shippingAddress?.address,
                            shippingAddress?.city,
                            shippingAddress?.state,
                            shippingAddress?.country,
                            shippingAddress?.postalCode,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                    </p>
                  ) : (
                    <p className="text-sm leading-6 text-gray-400">
                      Shipping address not available
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* =================================================
                STATUS
            ================================================== */}

            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      isPaid ? "bg-emerald-50" : "bg-orange-50"
                    }`}
                  >
                    {isPaid ? (
                      <CheckCheck size={21} className="text-emerald-500" />
                    ) : (
                      <Clock3 size={21} className="text-orange-500" />
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Payment</p>

                    <p className="font-bold capitalize text-[#566a7f]">
                      {paymentStatus}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                    <CreditCard size={20} className="text-blue-500" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Order</p>

                    <p className="font-bold capitalize text-[#566a7f]">
                      {orderStatus}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
