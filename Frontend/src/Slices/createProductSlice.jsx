import { createSlice } from "@reduxjs/toolkit";
import { createProductThunk } from "../Thunks/productThunk";

export const createProductSlice = createSlice({
  name: "createProducts",
  initialState: {
    data: null,
    pending: false,
    error: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProductThunk.pending, (state) => {
        state.error = false;
        state.pending = true;
      })
      .addCase(createProductThunk.rejected, (state) => {
        state.pending = false;
        state.error = true;
      })
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.error = false;
        state.pending = false;
        state.data = action.payload;
      });
  },
});

export default createProductSlice.reducer;
