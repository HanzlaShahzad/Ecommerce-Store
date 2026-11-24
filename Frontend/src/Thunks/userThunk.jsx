import { createAsyncThunk } from "@reduxjs/toolkit";
import URL from "../utils/api";

export const SignupThunk = createAsyncThunk(
  "SignupThunk",
  async ({ name, username, email, password }, { rejectWithValue }) => {
    try {
      const res = await URL.post("/signup", {
        name,
        username,
        email,
        password,
      });
      return res.data;
    } catch (error) {
      console.log("Signup Thunk Error => ", error);
      return rejectWithValue(error?.response?.data?.massege || "Signup Failed");
    }
  },
);

export const signinThunk = createAsyncThunk(
  "signinThunk",

  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await URL.post("/signin", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      console.log("Signin Data:", res.data);

      return res.data;
    } catch (error) {
      console.log("Signin Thunk Error =>", error);

      return rejectWithValue({
        status: error?.response?.status,

        message:
          error?.response?.data?.message ||
          error?.response?.data?.msg ||
          error?.message ||
          "Signin Failed",
      });
    }
  },
);

export const getUser = createAsyncThunk("getUsers", async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await URL.get("/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.users;
  } catch (error) {
    console.log("Get User Error :", error);
  }
});
