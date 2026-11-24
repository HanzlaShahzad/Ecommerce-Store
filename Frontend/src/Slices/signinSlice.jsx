import { createSlice } from "@reduxjs/toolkit";
import { signinThunk } from "../Thunks/userThunk";

export const signinUserSlice = createSlice({
  name: "signin",
  initialState: {
    data: null,
    token: null,

    pending: false,
    error: false,
  },
  reducers: {
    logout: (state) => {
      state.data = null;
      state.pending = false;
      state.error = false;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signinThunk.pending, (state) => {
        state.error = false;
        state.pending = true;
      })
      .addCase(signinThunk.rejected, (state) => {
        state.pending = false;
        state.error = true;
      })
      .addCase(signinThunk.fulfilled, (state, action) => {
        state.error = false;
        state.pending = false;
        state.data = action.payload;
        state.token = action.payload.token;
      });
  },
});

export const { logout } = signinUserSlice.actions;
export default signinUserSlice.reducer;
