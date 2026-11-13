import { createSlice } from "@reduxjs/toolkit";
import { updateProductThunk } from "../Thunks/productThunk";

export const updateProductSlice = createSlice({
  name: "updateProducts",
  initialState: {
    data: null,
    pending: false,
    error: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProductThunk.pending, (state) => {
        state.error = false;
        state.pending = true;
      })
      .addCase(updateProductThunk.rejected, (state) => {
        state.pending = false;
        state.error = true;
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        state.error = false;
        state.pending = false;
        state.data = action.payload;
      });
  },
});

export default updateProductSlice.reducer;
