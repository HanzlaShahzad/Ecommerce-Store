import { createSlice } from "@reduxjs/toolkit";
import { SignupThunk } from "../Thunks/userThunk";

export const signupUserSlice = createSlice({
  name: "signup",
  initialState: {
    data: null,
    pending: false,
    error: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(SignupThunk.pending, (state) => {
        state.error = false;
        state.pending = true;
      })
      .addCase(SignupThunk.rejected, (state) => {
        state.pending = false;
        state.error = true;
      })
      .addCase(SignupThunk.fulfilled, (state, action) => {
        state.error = false;
        state.pending = false;
        state.data = action.payload;
      });
  },
});

export default signupUserSlice.reducer;
