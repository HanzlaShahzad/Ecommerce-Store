import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
          element: <Checkout />,
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
          element: <MyOrders />,
        },
        {
          path: "/products",
          element: (
            <ProtectedRoute>
              <Products />,
            </ProtectedRoute>
          ),
        },
        {
          path: "/orders",
          element: (
            <ProtectedRoute>
              <TotalOrders />,
            </ProtectedRoute>
          ),
        },
        {
          path: "/users",
          element: (
            <ProtectedRoute>
              <AllUsers />,
            </ProtectedRoute>
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
