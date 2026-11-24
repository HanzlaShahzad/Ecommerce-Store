import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";

import Home from "./Pages/Home";
import Signin from "./Pages/Signin";
import ProductCard from "./Pages/CreateProducts";
import Outlets from "./Outlet/outlet";
import Contact from "./Pages/Contact";
import ProtectedRoute from "./ProtectRoutes/protectRoute.jsx";
import Signup from "./Pages/Signup.jsx";

import VerifyEmail from "./Pages/verifyEmail.jsx";

import VerificationSuccess from "./Pages/verificationSuccess.jsx";
import VerifyEmailMessage from "./Pages/verifyEmailMassege.jsx";
import Checkout from "./Pages/Checkout.jsx";
import Success from "./Pages/stripeSuccess.jsx";
import Cancel from "./Pages/stripeCancel.jsx";
import AllUsers from "./Pages/AllUsers.jsx";
import MyOrders from "./Pages/myOrders.jsx";
import Admin from "./Pages/Admin.jsx";
import Products from "./Pages/Products.jsx";
import TotalOrders from "./Pages/totalOrders.jsx";
import OrderDetails from "./Pages/orderDetails.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "signup",
      element: <Signup />,
    },
    {
      path: "signin",
      element: <Signin />,
    },
    {
      path: "/",
      element: <Outlets />,

      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/admin",
          element: (
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          ),
        },
        {
          path: "createProducts",
          element: (
            <ProtectedRoute>
              <ProductCard />
            </ProtectedRoute>
          ),
        },
        {
          path: "orderDetails/:id",
          element: (
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          ),
        },

        {
          path: "contact",
          element: <Contact />,
        },

        {
          path: "verify-email",
          element: <VerifyEmailMessage />,
        },
        {
          path: "verify-email/:token",
          element: <VerifyEmail />,
        },

        {
          path: "verificationSuccessfull",
          element: <VerificationSuccess />,
        },
        {
          path: "/checkout",
          element: (
            <ProtectedRoute allowedRoles={["Admin", "User"]}>
              <Checkout />
            </ProtectedRoute>
          ),
        },
        {
          path: "/success",
          element: <Success />,
        },
        {
          path: "/cancel",
          element: <Cancel />,
        },
        {
          path: "/myOrders",
          element: (
            <ProtectedRoute allowedRoles={["Admin", "User"]}>
              <MyOrders />
            </ProtectedRoute>
          ),
        },
        {
          path: "/products",
          element: (
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          ),
        },
        {
          path: "/orders",
          element: (
            <ProtectedRoute>
              <TotalOrders />
            </ProtectedRoute>
          ),
        },
        {
          path: "/users",
          element: (
            <ProtectedRoute>
              <AllUsers />
            </ProtectedRoute>
          ),
        },
        {
          path: "*",
          element: (
            <main className="mx-auto flex min-h-[55vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
                404 · Page not found
              </p>
              <h1 className="mt-3 text-3xl font-bold text-slate-950">
                This page doesn’t exist
              </h1>
              <p className="mt-2 text-slate-600">
                The link may be incorrect, or the page may have moved.
              </p>
              <Link
                to="/"
                className="mt-6 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                Back to the store
              </Link>
            </main>
          ),
        },
      ],
    },
  ]);

  return (
    <>
  <RouterProvider router={router} />
  
    </>
  )
}

export default App;
