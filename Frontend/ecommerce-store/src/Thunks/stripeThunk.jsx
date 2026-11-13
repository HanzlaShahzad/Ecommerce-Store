import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = axios.create({
  baseURL: "http://localhost:2000",
});

export const stripeThunk = createAsyncThunk(
  "stripeThunk",
  async ({ cartItems, orderId }, { rejectWithValue }) => {
    try {
      console.log("STRIPE THUNK ORDER ID =====>", orderId);

      const res = await URL.post("/create-checkout-session", {
        cartItems,
        orderId,
      });

      console.log("STRIPE RESPONSE =====>", res.data);

      if (res.data?.url) {
        window.location.href = res.data.url;
      }

      return res.data;
    } catch (error) {
      console.log(
        "STRIPE ERROR =====>",
        error?.response?.data || error.message,
      );

      return rejectWithValue(error?.response?.data || "Stripe checkout failed");
    }
  },
);

export const createOrder = createAsyncThunk(
  "createOrder",
  async ({ cartItems, totalPrice }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await URL.post(
        "/create-orders",
        {
          cartItems,
          totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("ORDER API RESPONSE =====>", res.data);

      return res.data;
    } catch (error) {
      console.log(
        "CREATE ORDER ERROR =====>",
        error?.response?.data || error.message,
      );

      return rejectWithValue(error?.response?.data || "Order creation failed");
    }
  },
);

export const getOrder = createAsyncThunk(
  "getOrder",

  async ({ id }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue({
          message: "Token not found in localStorage",
        });
      }

      const res = await axios.get(`http://localhost:2000/myOrders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.orders;
    } catch (error) {
      console.log("GET ORDER ERROR =>", error);

      console.log("BACKEND ERROR =>", error.response?.data);

      return rejectWithValue(
        error.response?.data || {
          message: error.message,
        },
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
      console.log("Total Order =>", res.data.orders);
      return res.data.orders;
    } catch (error) {
      console.log("totalOrder ERROR =>", error);

      console.log("BACKEND ERROR =>", error.response?.data);

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
      console.log("specificOrder =>", res.data.specificOrder);
      return res.data.specificOrder;
    } catch (error) {
      console.log("specificOrder ERROR =>", error);

      console.log("BACKEND ERROR =>", error.response?.data);

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
      console.error("DELETE ORDER ERROR:", error);
      return rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
);
