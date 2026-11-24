import { createAsyncThunk } from "@reduxjs/toolkit";
import URL from "../utils/api";

export const getChartThunk = createAsyncThunk(
  "getChartThunk",
  async (_, { rejectWithValue }) => {
    try {
      const res = await URL.get("/dashboard/revenue");

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "getChartThunk Failed",
      );
    }
  },
);
