import { createSlice } from "@reduxjs/toolkit";
import { getUser } from "../Thunks/userThunk";

export const getUsersSlice = createSlice({
  name: "getUser",
  initialState: {
    data: [],
    pending: false,
    error: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.error = false;
        state.pending = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.pending = false;
        state.error = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.error = false;
        state.pending = false;
        state.data = action.payload;
      });
  },
});

export default getUsersSlice.reducer;
