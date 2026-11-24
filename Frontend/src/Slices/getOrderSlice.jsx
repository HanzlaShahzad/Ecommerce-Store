import { createSlice } from "@reduxjs/toolkit";
import { getOrder } from "../Thunks/stripeThunk";

export const getOrderSlice = createSlice({
  name: "getOrders",
  initialState: {
    orders: [],
    pending: false,
    error: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrder.pending, (state) => {
        state.error = false;
        state.pending = true;
      })
      .addCase(getOrder.rejected, (state) => {
        state.pending = false;
        state.error = true;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.error = false;
        state.pending = false;
        state.orders = action.payload;
      });
  },
});

export default getOrderSlice.reducer;
