import { createAsyncThunk } from "@reduxjs/toolkit";
import URL from "../utils/api";

export const getChartThunk = createAsyncThunk(
  "getChartThunk",
  async (_, { rejectWithValue }) => {
    try {
      const res = await URL.get("/dashboard/revenue");

      console.log("Chart RESPONSE =>", res.data);

      return res.data;
    } catch (error) {
      console.log("getChartThunk Error =>", error);

      return rejectWithValue(
        error?.response?.data?.message || "getChartThunk Failed",
      );
    }
  },
);
