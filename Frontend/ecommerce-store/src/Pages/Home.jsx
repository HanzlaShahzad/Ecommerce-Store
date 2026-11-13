import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductThunk, updateProductThunk } from "../Thunks/productThunk";
import { useNavigate } from "react-router-dom";
import { FaDeleteLeft } from "react-icons/fa6";
import axios from "axios";
import { MdEditNote } from "react-icons/md";
import {
  addToCart,
  increaseQuantitys,
  decreaseQuantitys,
  removeFromCarts,
  clearCart,
} from "../Slices/cartSlice.jsx";

export default function Home() {
  const dispatch = useDispatch();

  const { data, pending, error } = useSelector((state) => state.getProducts);
  const searchItem = useSelector((state) => state.getProducts.searchItem);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { token } = useSelector((state) => state.signin);

  const [localProducts, setLocalProducts] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProductThunk());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(data)) {
      setLocalProducts(data);
    }
  }, [data]);

  const products = localProducts;

  // PRICE CALCULATION
  const getDiscountedPrice = (price, discount) => {
    const originalPrice = Number(price) || 0;
    const discountPercent = Number(discount) || 0;

    return originalPrice - (originalPrice * discountPercent) / 100;
  };

  // ADD PRODUCT TO CART

  const handleAddProduct = (product) => {
    dispatch(addToCart(product));
    // Open cart after adding
    setCartOpen(true);
  };

  // INCREASE QUANTITY
  const increaseQuantity = (id) => {
    dispatch(increaseQuantitys(id));
  };

  // DECREASE QUANTITY
  const decreaseQuantity = (id) => {
    dispatch(decreaseQuantitys(id));
  };

  // REMOVE PRODUCT
  const removeFromCart = (id) => {
    dispatch(removeFromCarts(id));
  };

  // TOTAL ITEMS
  const cartCount = cartItems.reduce(
    (total, item) => total + item.cartQuantity,
    0,
  );

  // SUBTOTAL
  const subtotal = cartItems.reduce((total, item) => {
    const discountedPrice = getDiscountedPrice(item.price, item.discount);

    return total + discountedPrice * item.cartQuantity;
  }, 0);

  const filteredProduct = products.filter((item) =>
    item?.name.toLowerCase().includes(searchItem?.toLowerCase() || ""),
  );

  return (
    <div className="min-h-screen w-full bg-white">
      {/* MAIN CONTENT */}
      <div className="flex w-full">
        <main
          className={`
            min-w-0
            w-full
            flex-1
            px-3
            py-5
            sm:px-4
            sm:py-6
            md:px-5
            lg:px-6
            lg:ml-[260px]
            ${cartOpen ? "lg:pr-[350px]" : ""}
          `}
        >
          {/* HEADER */}

          <div
            className="
              mb-5
              flex
              items-center
              justify-between
              sm:mb-6
            "
          >
            <div>
              <h1
                className="
                  text-xl
                  font-bold
                  text-gray-900
                  sm:text-2xl
                "
              >
                All Products
              </h1>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-500
                  sm:text-sm
                "
              >
                Discover our latest products
              </p>
            </div>
          </div>

          {/* LOADING */}

          {pending && (
            <div
              className="
                flex
                min-h-[400px]
                items-center
                justify-center
              "
            >
              <div
                className="
                  h-9
                  w-9
                  animate-spin
                  rounded-full
                  border-4
                  border-gray-200
                  border-t-orange-500
                  sm:h-10
                  sm:w-10
                "
              />
            </div>
          )}

          {/* ERROR */}

          {error && !pending && (
            <div
              className="
                flex
                min-h-[300px]
                items-center
                justify-center
                px-4
              "
            >
              <div
                className="
                  rounded-lg
                  bg-red-50
                  px-5
                  py-4
                  text-center
                  text-sm
                  text-red-600
                "
              >
                Failed to load products.
              </div>
            </div>
          )}

          {/* PRODUCTS */}

          {!pending && !error && products.length > 0 && (
            <div
              className="
                  grid
                  grid-column-end
                  w-full
                  grid-cols-2
                  gap-x-3
                  gap-y-7
                  sm:grid-cols-3
                  sm:gap-x-4
                  sm:gap-y-8
                  md:grid-cols-3
                  md:gap-x-4
                  md:gap-y-8
                  lg:grid-cols-3
                  lg:gap-x-4
                  xl:grid-cols-4
                "
            >
              {filteredProduct.map((product) => {
                const price = Number(product.price) || 0;

                const discount = Number(product.discount) || 0;

                const discountPrice = getDiscountedPrice(price, discount);

                return (
                  <div
                    key={product._id}
                    className={`
                        ${
                          product.deleted === true
                            ? "hidden"
                            : "block group min-w-0 w-full h-auto cursor-pointer"
                        }
                      `}
                  >
                    {/* IMAGE */}

                    <div
                      className="
                          relative
                          flex
                          h-[190px]
                          w-full
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-xl
                          bg-gray-100
                          sm:h-[180px]
                          md:h-[175px]
                          lg:h-[190px]
                          xl:h-[200px]
                        "
                    >
                      {product.image ? (
                        <img
                          src={`http://localhost:2000/uploads/${product.image}`}
                          alt={product.name}
                          className="
                              h-full
                              w-full
                              object-cover
                              transition
                              duration-300
                              group-hover:scale-105
                              sm:w-[100%]
                              h-full
                              md:w-[100%]
                              lg:w-full
                            "
                        />
                      ) : (
                        <div
                          className="
                              flex
                              h-full
                              w-full
                              items-center
                              justify-center
                              text-sm
                              font-medium
                              text-gray-400
                            "
                        >
                          No Image
                        </div>
                      )}

                      {/* DISCOUNT */}

                      {discount > 0 && (
                        <span
                          className="
                              absolute
                              left-2
                              top-2
                              rounded
                              bg-orange-500
                              px-2
                              py-1
                              text-[10px]
                              font-bold
                              text-white
                              shadow-sm
                              sm:text-xs
                            "
                        >
                          -{discount}%
                        </span>
                      )}

                      {/* ADD TO CART */}

                      <button
                        type="button"
                        disabled={
                          Number(product.quantity) <= 0 ||
                          product.status === "InActive"
                        }
                        onClick={(e) => {
                          e.stopPropagation();

                          if (Number(product.quantity) > 0) {
                            handleAddProduct(product);
                          }
                        }}
                        className={`
                            absolute
                            bottom-2
                            right-2
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            text-base
                            text-white
                            shadow-md
                            transition
                            sm:h-10
                            sm:w-10
                            md:h-10
                            md:w-10
                            lg:h-10
                            lg:w-10
                            lg:text-xl

                            ${
                              Number(product.quantity) <= 0 ||
                              product.status === "InActive"
                                ? "cursor-not-allowed bg-gray-400"
                                : "bg-orange-500 hover:scale-110 hover:bg-orange-600"
                            }
                          `}
                      >
                        🛒
                      </button>
                    </div>

                    {/* DETAILS */}

                    <div className="pt-2.5 sm:pt-3">
                      {/* NAME */}

                      <h2
                        className="
                            line-clamp-2
                            min-h-[38px]
                            text-sm
                            leading-5
                            font-bold
                            text-gray-800
                          "
                      >
                        {product.name}
                      </h2>

                      {/* RATING */}

                      <div className="flex items-center gap-1">
                        <span className="text-xs">⭐⭐⭐⭐⭐</span>

                        <span
                          className="
                              text-[11px]
                              text-gray-500
                              sm:text-xs
                            "
                        >
                          4.8
                        </span>
                      </div>

                      {/* PRICE */}

                      <div
                        className="
                            mt-1
                            flex
                            flex-wrap
                            items-center
                            gap-1.5
                            sm:gap-2
                          "
                      >
                        <span
                          className="
                              text-lg
                              font-bold
                              text-orange-600
                              sm:text-xl
                            "
                        >
                          Rs. {discountPrice.toLocaleString()}
                        </span>

                        {discount > 0 && (
                          <span
                            className="
                                text-[11px]
                                text-gray-400
                                line-through
                                sm:text-xs
                              "
                          >
                            Rs. {price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* DESCRIPTION */}

                      <p
                        className="
                            mt-1
                            line-clamp-2
                            text-[11px]
                            leading-4
                            text-gray-500
                            sm:text-xs
                          "
                      >
                        {product.description}
                      </p>

                      {/* STOCK */}

                      <div className="mt-1.5 sm:mt-2">
                        {Number(product.quantity) > 0 ? (
                          <span
                            className="
                                text-[11px]
                                font-semibold
                                text-green-600
                                sm:text-xs
                              "
                          >
                            In Stock · {product.quantity} available
                          </span>
                        ) : (
                          <span
                            className="
                                text-[11px]
                                font-semibold
                                text-red-500
                                sm:text-xs
                              "
                          >
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* NO PRODUCTS */}

          {!pending && !error && products.length === 0 && (
            <div
              className="
                  flex
                  min-h-[400px]
                  flex-col
                  items-center
                  justify-center
                  px-4
                  text-center
                "
            >
              <div className="text-5xl sm:text-6xl">📦</div>

              <h2
                className="
                    mt-4
                    text-lg
                    font-bold
                    text-gray-800
                    sm:text-xl
                  "
              >
                No Products Found
              </h2>

              <p
                className="
                    mt-1
                    text-xs
                    text-gray-500
                    sm:text-sm
                  "
              >
                Add products from the admin panel.
              </p>
            </div>
          )}
        </main>

        {/* =====================================================
            MOBILE + TABLET CART BUTTON
        ===================================================== */}

        {!cartOpen && (
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="
              fixed
              bottom-5
              right-4
              z-[60]
              flex
              items-center
              gap-2
              rounded-full
              bg-orange-500
              px-4
              py-3
              text-sm
              font-bold
              text-white
              shadow-xl
              transition
              hover:bg-orange-600
            "
          >
            🛒 Cart ({cartCount})
          </button>
        )}

        {/* =====================================================
            MOBILE + TABLET OVERLAY
        ===================================================== */}

        {cartOpen && (
          <div
            onClick={() => setCartOpen(false)}
            className="
              fixed
              inset-0
              z-40
              bg-black/40
            "
          />
        )}

        {/* =====================================================
            SHOPPING CART
        ===================================================== */}

        <aside
          className={`
            fixed
            right-0
            top-0
            z-50
            flex
            h-screen
            flex-col
            border-l
            border-gray-200
            bg-white
            shadow-xl
            transition-transform
            duration-300
            w-[285px]
            sm:w-[300px]
            md:w-[320px]
            lg:w-[330px]

            ${cartOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0 hidden"}
          `}
        >
          {/* CART HEADER */}

          <div
            className="
              flex
              h-[64.5px]
              items-center
              justify-between
              border-b
              border-orange-600
              bg-orange-500
              px-4
              py-4
              text-white
            "
          >
            <div>
              <h2 className="text-lg font-bold">Shopping Cart</h2>

              <p className="text-xs">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </p>
            </div>

            {/* CLOSE */}

            <button
              type="button"
              onClick={() => setCartOpen(false)}
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                bg-white/20
                pb-1
                text-lg
                text-white
                transition
                hover:bg-white/30
              "
            >
              ×
            </button>
          </div>

          {/* CART BODY */}

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {cartItems.length === 0 ? (
              /* EMPTY CART */

              <div
                className="
                  flex
                  h-full
                  flex-col
                  items-center
                  justify-center
                  text-center
                "
              >
                <div className="text-6xl">🛒</div>

                <h3
                  className="
                    mt-4
                    text-base
                    font-bold
                    text-gray-800
                  "
                >
                  Your cart is empty
                </h3>

                <p
                  className="
                    mt-1
                    max-w-[220px]
                    text-xs
                    text-gray-500
                  "
                >
                  Add some products to your cart and they will appear here.
                </p>
              </div>
            ) : (
              /* CART ITEMS */

              <div className="space-y-3">
                {cartItems.map((item) => {
                  const originalPrice = Number(item.price) || 0;

                  const discount = Number(item.discount) || 0;

                  const discountedPrice = getDiscountedPrice(
                    originalPrice,
                    discount,
                  );

                  const itemTotal = discountedPrice * item.cartQuantity;

                  return (
                    <div
                      key={item._id}
                      className="
                        rounded-lg
                        border
                        border-gray-200
                        p-3
                      "
                    >
                      <div className="flex gap-3">
                        {/* IMAGE */}

                        <div
                          className="
                            h-16
                            w-16
                            flex-shrink-0
                            overflow-hidden
                            rounded-lg
                            bg-gray-100
                          "
                        >
                          <img
                            src={`http://localhost:2000/uploads/${item.image}`}
                            alt={item.name}
                            className="
                              h-full
                              w-full
                              object-contain
                            "
                          />
                        </div>

                        {/* DETAILS */}

                        <div className="min-w-0 flex-1">
                          <h3
                            className="
                              truncate
                              text-sm
                              font-semibold
                              text-gray-800
                            "
                          >
                            {item.name}
                          </h3>

                          {/* DISCOUNTED UNIT PRICE */}

                          <p
                            className="
                              mt-1
                              text-sm
                              font-bold
                              text-orange-600
                            "
                          >
                            Rs. {discountedPrice.toLocaleString()}
                          </p>

                          {/* ORIGINAL PRICE */}

                          {discount > 0 && (
                            <p
                              className="
                                text-[10px]
                                text-gray-400
                                line-through
                              "
                            >
                              Rs. {originalPrice.toLocaleString()}
                            </p>
                          )}

                          {/* QUANTITY */}

                          <div
                            className="
                              mt-2
                              flex
                              items-center
                              justify-between
                            "
                          >
                            <div
                              className="
                                flex
                                items-center
                                rounded-md
                                border
                                border-gray-300
                              "
                            >
                              {/* MINUS */}

                              <button
                                type="button"
                                onClick={() => decreaseQuantity(item._id)}
                                className="
                                  flex
                                  h-7
                                  w-7
                                  items-center
                                  justify-center
                                  text-gray-700
                                  transition
                                  hover:bg-gray-100
                                "
                              >
                                −
                              </button>

                              {/* QUANTITY */}

                              <span
                                className="
                                  min-w-[28px]
                                  text-center
                                  text-xs
                                  font-semibold
                                  text-gray-800
                                "
                              >
                                {item.cartQuantity}
                              </span>

                              {/* PLUS */}

                              <button
                                type="button"
                                onClick={() => increaseQuantity(item._id)}
                                disabled={
                                  item.cartQuantity >= Number(item.quantity)
                                }
                                className="
                                  flex
                                  h-7
                                  w-7
                                  items-center
                                  justify-center
                                  text-gray-700
                                  transition
                                  hover:bg-gray-100
                                  disabled:cursor-not-allowed
                                  disabled:text-gray-300
                                "
                              >
                                +
                              </button>
                            </div>

                            {/* REMOVE */}

                            <button
                              type="button"
                              onClick={() => removeFromCart(item._id)}
                              className="
                                text-xs
                                font-semibold
                                text-red-500
                                transition
                                hover:text-red-700
                              "
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* ITEM TOTAL */}

                      <div
                        className="
                          mt-3
                          flex
                          items-center
                          justify-between
                          border-t
                          border-gray-100
                          pt-2
                        "
                      >
                        <span
                          className="
                            text-xs
                            text-gray-500
                          "
                        >
                          Item Total
                        </span>

                        <span
                          className="
                            text-sm
                            font-bold
                            text-gray-800
                          "
                        >
                          Rs. {itemTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* CART FOOTER */}

          <div
            className="
              border-t-4
              border-orange-500
              bg-orange-500
              p-4
            "
          >
            <div
              className="
                mb-3
                flex
                items-center
                justify-between
              "
            >
              <span
                className="
                  text-sm
                  font-semibold
                  text-white
                "
              >
                Subtotal
              </span>

              <span
                className="
                  text-lg
                  font-bold
                  text-white
                "
              >
                Rs. {subtotal.toLocaleString()}
              </span>
            </div>

            <button
              type="button"
              disabled={cartItems.length === 0}
              onClick={() => {
                if (token) {
                  navigate("/checkout", {
                    state: {
                      cartItems,
                    },
                  });
                } else {
                  alert("please signin first");
                }
              }}
              className="
                w-full
                rounded-lg
                bg-white
                px-4
                py-3
                text-sm
                font-bold
                text-orange-600
                shadow-sm
                transition
                hover:bg-gray-100
                disabled:cursor-not-allowed
                disabled:bg-gray-200
                disabled:text-gray-400
              "
            >
              Proceed to Checkout
            </button>
          </div>
        </aside>
      </div>
      {/* FOOTER */}
    </div>
  );
}
