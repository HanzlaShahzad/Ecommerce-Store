import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = axios.create({
  baseURL: "http://localhost:2000",
});

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
