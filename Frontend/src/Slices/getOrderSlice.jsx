import { createSlice } from "@reduxjs/toolkit";
import { getOrder, getUserOrders } from "../Thunks/stripeThunk";

export const getOrderSlice = createSlice({
  name: "getOrders",
  initialState: {
    orders: [],
    pending: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrder.pending, (state) => {
        state.error = null;
        state.pending = true;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.pending = false;
        state.error = action.payload || { message: "Unable to load orders." };
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.error = null;
        state.pending = false;
        state.orders = action.payload;
      })
      .addCase(getUserOrders.pending, (state) => {
        state.error = null;
        state.pending = true;
        state.orders = [];
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.pending = false;
        state.error = action.payload || { message: "Unable to load user orders." };
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.error = null;
        state.pending = false;
        state.orders = action.payload;
      });
  },
});

export default getOrderSlice.reducer;
