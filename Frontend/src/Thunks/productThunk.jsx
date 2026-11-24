import { createAsyncThunk } from "@reduxjs/toolkit";
import URL from "../utils/api";

export const createProductThunk = createAsyncThunk(
  "createProductThunk",
  async (
    { name, discount, quantity, price, description, file },
    { rejectWithValue },
  ) => {
    try {
      const formData = new FormData();
      const token = localStorage.getItem("token");

      formData.append("name", name);
      formData.append("discount", discount);
      formData.append("quantity", quantity);
      formData.append("price", price);
      formData.append("description", description);

      if (file) {
        formData.append("image", file);
      }

      // Send multipart/form-data
      const res = await URL.post("/createProducts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "createProductThunk Failed",
      );
    }
  },
);

export const getProductThunk = createAsyncThunk(
  "getProductThunk",
  async (_, { rejectWithValue }) => {
    try {
      const res = await URL.get("/products");

      return res.data.products;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "getProductThunk Failed",
      );
    }
  },
);

export const deleteProductThunk = createAsyncThunk(
  "deleteProductThunk",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      await URL.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return id;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to delete product",
      );
    }
  },
);

export const updateProductThunk = createAsyncThunk(
  "updateProductThunk",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      formData.append("id", id);
      const token = localStorage.getItem("token");

      const res = await URL.patch("/updateProducts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "updateProductThunk Failed",
      );
    }
  },
);
