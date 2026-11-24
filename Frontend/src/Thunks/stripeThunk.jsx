import { createAsyncThunk } from "@reduxjs/toolkit";
import URL from "../utils/api";

export const stripeThunk = createAsyncThunk(
  "stripeThunk",
  async ({ orderId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue({ message: "Please sign in before checkout." });
      }

      const res = await URL.post("/create-checkout-session", {
        orderId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        return rejectWithValue({ message: "Checkout did not return a payment link." });
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: error.message || "Stripe checkout failed." },
      );
    }
  },
);

export const createOrder = createAsyncThunk(
  "createOrder",
  async ({ cartItems }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await URL.post(
        "/create-orders",
        {
          cartItems,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: error.message || "Order creation failed." },
      );
    }
  },
);

export const getOrder = createAsyncThunk(
  "getOrder",

  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue({
          message: "Token not found in localStorage",
        });
      }

      const res = await URL.get("/myOrders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.orders;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: error.message,
        },
      );
    }
  },
);

export const getUserOrders = createAsyncThunk(
  "getUserOrders",
  async ({ id }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue({ message: "Authentication required." });
      }

      const res = await URL.get(`/users/${id}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.orders;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message || "Unable to load user orders." },
      );
    }
  },
);

export const totalOrder = createAsyncThunk(
  "totalOrder",

  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue({
          message: "Token not found in localStorage",
        });
      }

      const res = await URL.get("/totalOrders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.orders;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: error.message,
        },
      );
    }
  },
);

export const specificOrder = createAsyncThunk(
  "specificOrder",

  async ({ id }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue({
          message: "Token not found in localStorage",
        });
      }

      const res = await URL.get(`/specificOrder/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.specificOrder;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: error.message,
        },
      );
    }
  },
);

export const deleteOrder = createAsyncThunk(
  "deleteOrder",
  async ({ id }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue({ message: "Token not found in localStorage" });
      }

      await URL.delete(`/deleteOrder/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
);
