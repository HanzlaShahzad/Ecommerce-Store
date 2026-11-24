import { useEffect } from "react";
import { ShoppingCart, Tag } from "lucide-react";
import RevenueChart from "../components/Charts/revenueCharts";
import { MdPendingActions, MdCrisisAlert } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { totalOrder } from "../Thunks/stripeThunk";
import { getUser } from "../Thunks/userThunk";

const Dashboard = () => {
  const order = useSelector((state) => state.totalOrders?.totalOrder);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(totalOrder());
    dispatch(getUser());
  }, [dispatch]);

  // Make sure orders are always an array
  const orders = Array.isArray(order) ? order : [];

  // =========================================================
  // TOTAL SALES
  // =========================================================
  const total = orders.reduce(
    (sum, item) =>
      item?.paymentStatus === "paid"
        ? sum + (Number(item?.totalPrice) || 0)
        : sum,
    0,
  );

  // =========================================================
  // FULFILLED SALES
  // =========================================================
  const fulfilled = orders
    .filter((item) => item?.paymentStatus === "paid")
    .reduce((sum, item) => sum + (Number(item?.totalPrice) || 0), 0);

  // =========================================================
  // PENDING SALES
  // =========================================================
  const pending = orders
    .filter((item) => item?.paymentStatus === "unpaid")
    .reduce((sum, item) => sum + (Number(item?.totalPrice) || 0), 0);

  // =========================================================
  // PAID PURCHASES
  // =========================================================
  const purchaseLength = orders.filter(
    (item) => item?.paymentStatus === "paid",
  );

  // =========================================================
  // FORMAT AMOUNT
  // =========================================================
  const formatAmount = (amount) => {
    const value = Number(amount) || 0;

    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }

    return value.toLocaleString();
  };

  return (
    <div className="min-h-[65vh] bg-slate-50 text-slate-700">
      {/* =====================================================
          MAIN AREA
      ===================================================== */}
      <main
        className="
          min-w-0
          lg:ml-[260px]
          lg:w-[calc(100%-260px)]
        "
      >
        <section
          className="
            min-h-full
            p-3

            sm:p-4

            lg:overflow-visible
            lg:p-4

            xl:p-5
          "
        >
          {/* =====================================================
              MAIN DASHBOARD GRID

              Desktop:
              Row 1 = 400px
              Row 2 = 100px
          ===================================================== */}
          <div
            className="
              grid
              grid-cols-1
              gap-3

              sm:grid-cols-2

              lg:h-auto
              lg:min-h-0
              lg:grid-cols-4
              lg:grid-rows-[400px_100px]
              lg:gap-4
            "
          >
            {/* =====================================================
                REVENUE GROWTH
            ===================================================== */}
            <div
              className="
                flex
                min-h-[300px]
                flex-col
                rounded-2xl
                bg-white
                p-3
                shadow-[0_5px_20px_rgba(0,0,0,0.06)]

                sm:p-4

                lg:col-span-2
                lg:h-[400px]
                lg:min-h-0
                lg:overflow-hidden
                lg:p-4
              "
            >
              {/* Chart Header */}
              <div className="flex shrink-0 items-center justify-between gap-3">
                <div>
                  <h2
                    className="
                      text-base
                      font-semibold
                      text-[#53677b]

                      sm:text-lg
                    "
                  >
                    Revenue Growth
                  </h2>

                  <p className="mt-0.5 text-xs text-[#8a9aaa]">
                    Weekly revenue overview
                  </p>
                </div>

                <button
                  type="button"
                  className="
                    shrink-0
                    rounded-lg
                    px-2.5
                    py-1.5
                    text-xs
                    font-medium
                    text-[#5b8def]
                    transition
                    hover:bg-[#edf2fb]
                  "
                >
                  View All
                </button>
              </div>

              {/* D3 Revenue Chart */}
              <div
                className="
                  mt-2
                  min-h-0
                  flex-1
                  overflow-hidden
                "
              >
                <RevenueChart />
              </div>
            </div>

            {/* =====================================================
                TOTAL ORDERS
            ===================================================== */}
            <div
              className="
                flex
                min-h-[180px]
                flex-col
                items-center
                justify-center
                rounded-2xl
                bg-white
                p-4
                shadow-[0_5px_20px_rgba(0,0,0,0.06)]

                sm:p-5

                lg:h-[400px]
                lg:min-h-0
                lg:p-4
              "
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  bg-[#ddf8ec]

                  sm:h-14
                  sm:w-14
                "
              >
                <Tag size={24} className="text-[#35d58b]" />
              </div>

              <div className="mt-3 text-center">
                <p
                  className="
                    text-[15px]
                    text-[#718398]

                    sm:text-[16px]
                  "
                >
                  Orders
                </p>

                <h2
                  className="
                    mt-1
                    text-[32px]
                    font-bold
                    text-[#53677b]

                    sm:text-[38px]

                    xl:text-[42px]
                  "
                >
                  {orders.length}
                </h2>
              </div>
            </div>

            {/* =====================================================
                PURCHASE LENGTH
            ===================================================== */}
            <div
              className="
                flex
                min-h-[180px]
                flex-col
                items-center
                justify-center
                rounded-2xl
                bg-white
                p-4
                shadow-[0_5px_20px_rgba(0,0,0,0.06)]

                sm:p-5

                lg:h-[400px]
                lg:min-h-0
                lg:p-4
              "
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  bg-[#ffe3e3]

                  sm:h-14
                  sm:w-14
                "
              >
                <ShoppingCart size={24} className="text-[#ff6268]" />
              </div>

              <div className="mt-3 text-center">
                <p
                  className="
                    text-[15px]
                    text-[#718398]

                    sm:text-[16px]
                  "
                >
                  Purchase
                </p>

                <h2
                  className="
                    mt-1
                    text-[32px]
                    font-bold
                    text-[#53677b]

                    sm:text-[38px]

                    xl:text-[42px]
                  "
                >
                  {purchaseLength.length}
                </h2>
              </div>
            </div>

            {/* =====================================================
                BOTTOM THREE SALES BOXES
            ===================================================== */}
            <div
              className="
                grid
                grid-cols-1
                gap-3

                sm:col-span-2
                sm:grid-cols-3

                lg:col-span-4
                lg:grid-cols-3
                lg:gap-4
                lg:h-[100px]
              "
            >
              {/* =====================================================
                  TOTAL SALES
              ===================================================== */}
              <div
                className="
                  flex
                  min-h-[100px]
                  flex-col
                  justify-center
                  rounded-2xl
                  bg-white
                  p-4
                  shadow-[0_5px_20px_rgba(0,0,0,0.06)]

                  lg:h-[100px]
                  lg:min-h-0
                  lg:p-4
                "
              >
                <p
                  className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-[#8a9aaa]
                  "
                >
                  <MdCrisisAlert className="text-cyan-500" size={18} />
                  Total Sales
                </p>

                <h2
                  className="
                    mt-1
                    text-2xl
                    font-bold
                    text-cyan-500

                    lg:text-2xl
                  "
                >
                  Rs. {formatAmount(total)}
                </h2>
              </div>

              {/* =====================================================
                  PENDING
              ===================================================== */}
              <div
                className="
                  flex
                  min-h-[100px]
                  flex-col
                  justify-center
                  rounded-2xl
                  bg-white
                  p-4
                  shadow-[0_5px_20px_rgba(0,0,0,0.06)]

                  lg:h-[100px]
                  lg:min-h-0
                  lg:p-4
                "
              >
                <p
                  className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-[#8a9aaa]
                  "
                >
                  <MdPendingActions className="text-red-600" size={18} />
                  Pending
                </p>

                <h2
                  className="
                    mt-1
                    text-2xl
                    font-bold
                    text-red-400

                    lg:text-2xl
                  "
                >
                  Rs. {formatAmount(pending)}
                </h2>
              </div>

              {/* =====================================================
                  FULFILLED
              ===================================================== */}
              <div
                className="
                  flex
                  min-h-[100px]
                  flex-col
                  justify-center
                  rounded-2xl
                  bg-white
                  p-4
                  shadow-[0_5px_20px_rgba(0,0,0,0.06)]

                  lg:h-[100px]
                  lg:min-h-0
                  lg:p-4
                "
              >
                <p
                  className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-[#8a9aaa]
                  "
                >
                  <TbTruckDelivery className="text-green-500" size={18} />
                  Fulfilled
                </p>

                <h2
                  className="
                    mt-1
                    text-2xl
                    font-bold
                    text-green-500

                    lg:text-2xl
                  "
                >
                  Rs. {formatAmount(fulfilled)}
                </h2>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
};

export default Dashboard;
