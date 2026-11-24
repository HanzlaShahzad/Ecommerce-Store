import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrder, stripeThunk } from "../Thunks/stripeThunk";
import { clearCart } from "../Slices/cartSlice";
import { getProductImageUrl } from "../utils/productImage";

export default function Checkout() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const cartItems = location.state?.cartItems || [];

  // ================= STRIPE =================

  const handleStripe = async () => {
    if (cartItems.length === 0) return;

    try {
      // Create order in MongoDB
      const orderResult = await dispatch(
        createOrder({
          cartItems,
          totalPrice: total,
        }),
      ).unwrap();
      console.log("ORDER RESULT =====>", orderResult);

      // Get MongoDB _id
      const orderId = orderResult?.order?._id;

      console.log("ORDER ID =====>", orderId);

      if (!orderId) {
        console.log("ORDER ID NOT FOUND");
        return;
      }

      // Prepare Stripe items
      const stripeItems = cartItems.map((item) => ({
        ...item,
        quantity: Number(item.cartQuantity) || 1,
      }));

      // Send orderId to Stripe
      await dispatch(
        stripeThunk({
          cartItems: stripeItems,
          orderId: orderId,
        }),
      ).unwrap();
      dispatch(clearCart());
      cartItems.filter((val) => val === stripeItems);
    } catch (error) {
      console.log("CHECKOUT ERROR =====>", error);
    }
  };

  // ================= PRICING =================

  const subTotal = cartItems.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const discount = Number(item.discount) || 0;
    const quantity = Number(item.cartQuantity) || 1;

    const discountedPrice = price - (price * discount) / 100;

    return total + discountedPrice * quantity;
  }, 0);

  const originalTotal = cartItems.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.cartQuantity) || 1;

    return total + price * quantity;
  }, 0);

  const totalDiscount = originalTotal - subTotal;

  const deliveryCharges = cartItems.length > 0 ? 200 : 0;

  const total = subTotal + deliveryCharges;

  const totalItems = cartItems.reduce(
    (total, item) => total + (Number(item.cartQuantity) || 1),
    0,
  );

  // ================= EMPTY CART =================

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-4xl">
            🛒
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            Your cart is empty
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            You don't have any products in your cart yet.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 w-full rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:ml-[250px]">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-orange-600"
          >
            <span className="text-lg">←</span>
            Back to Cart
          </button>

          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <span className="hidden sm:inline">Secure Checkout</span>
            <span className="text-base">🔒</span>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* ================= HEADER ================= */}

        <div className="mb-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
                STEP 2 OF 2
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Checkout
              </h1>

              <p className="mt-1.5 text-sm text-gray-500">
                Review your order and complete your purchase.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-green-600">
                ✓
              </span>
              <span>Cart confirmed</span>
            </div>
          </div>
        </div>

        {/* =====================================================
            CHECKOUT GRID
        ===================================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-5 lg:col-span-7 xl:col-span-8">
            {/* ================= DELIVERY ================= */}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-lg">
                  🚚
                </div>

                <div>
                  <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                    Delivery Information
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                    Your order will be delivered to your provided contact
                    details.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-orange-100 bg-orange-50 p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-lg">📦</span>

                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      Standard Delivery
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-600">
                      Delivery charges of Rs. 200 will be added to your order.
                    </p>
                  </div>

                  <span className="ml-auto shrink-0 text-sm font-bold text-orange-600">
                    Rs. 200
                  </span>
                </div>
              </div>
            </section>

            {/* ================= PAYMENT ================= */}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-lg">
                  💳
                </div>

                <div>
                  <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                    Secure Payment
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                    You'll be securely redirected to Stripe to complete payment.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                    💳
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      Card Payment
                    </p>

                    <p className="text-xs text-gray-500">
                      Securely processed by Stripe
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold text-green-700">
                  SECURE
                </span>
              </div>
            </section>
          </div>

          {/* =================================================
              RIGHT — ORDER SUMMARY
          ================================================= */}

          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:sticky lg:top-5">
              {/* ================= SUMMARY HEADER ================= */}

              <div className="bg-orange-500 px-5 py-5 text-white sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">Order Summary</h2>

                    <p className="mt-1 text-xs text-orange-100">
                      {totalItems} {totalItems === 1 ? "item" : "items"} in your
                      order
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-lg">
                    🛒
                  </div>
                </div>
              </div>

              {/* ================= PRODUCTS ================= */}

              <div className="max-h-[390px] space-y-3 overflow-y-auto p-4 sm:p-5">
                {cartItems.map((product) => {
                  const price = Number(product.price) || 0;
                  const discount = Number(product.discount) || 0;
                  const quantity = Number(product.cartQuantity) || 1;

                  const discountedPrice = price - (price * discount) / 100;

                  const itemTotal = discountedPrice * quantity;

                  return (
                    <div
                      key={product._id}
                      className="flex gap-3 rounded-xl border border-gray-200 p-3"
                    >
                      {/* Image */}

                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={getProductImageUrl(product.image)}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />

                        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-bold text-white">
                          {quantity}
                        </span>
                      </div>

                      {/* Details */}

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-bold text-gray-800">
                          {product.name}
                        </h3>

                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs font-bold text-orange-600">
                            Rs. {discountedPrice.toLocaleString()}
                          </span>

                          {discount > 0 && (
                            <span className="text-[10px] text-gray-400 line-through">
                              Rs. {price.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-[11px] text-gray-500">
                          Qty: {quantity}
                        </p>
                      </div>

                      {/* Item Total */}

                      <div className="shrink-0 text-right">
                        <p className="text-[10px] text-gray-400">Total</p>

                        <p className="mt-1 text-sm font-bold text-gray-800">
                          Rs. {itemTotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ================= PRICE DETAILS ================= */}

              <div className="border-t border-gray-200" />

              <div className="space-y-3 p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Subtotal</span>

                  <span className="text-sm font-semibold text-gray-800">
                    Rs. {subTotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Delivery</span>

                  <span className="text-sm font-semibold text-gray-800">
                    Rs. {deliveryCharges.toLocaleString()}
                  </span>
                </div>

                {totalDiscount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">You saved</span>

                    <span className="text-sm font-bold text-green-600">
                      - Rs. {totalDiscount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="border-t border-dashed border-gray-200 pt-4">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-base font-bold text-gray-900">Total</p>

                      <p className="mt-0.5 text-[11px] text-gray-400">
                        Including delivery
                      </p>
                    </div>

                    <p className="text-2xl font-extrabold text-orange-600">
                      Rs. {total.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* ================= PLACE ORDER ================= */}

                <button
                  type="button"
                  disabled={cartItems.length === 0}
                  onClick={handleStripe}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-4 text-sm font-bold text-white shadow-md transition hover:bg-orange-600 hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
                >
                  <span>Place Order & Pay</span>
                  <span className="text-base">→</span>
                </button>

                {/* Security */}

                <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-gray-400">
                  <span>🔒</span>
                  <span>Secure checkout powered by Stripe</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
