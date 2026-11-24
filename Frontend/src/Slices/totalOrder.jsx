import { createSlice } from "@reduxjs/toolkit";
import { deleteOrder, totalOrder } from "../Thunks/stripeThunk";

export const getTotalSlice = createSlice({
  name: "totalOrders",
  initialState: {
    totalOrder: [],
    pending: false,
    error: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(totalOrder.pending, (state) => {
        state.error = false;
        state.pending = true;
      })
      .addCase(totalOrder.rejected, (state) => {
        state.pending = false;
        state.error = true;
      })
      .addCase(totalOrder.fulfilled, (state, action) => {
        state.error = false;
        state.pending = false;
        state.totalOrder = action.payload;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.totalOrder = state.totalOrder.filter(
          (order) => order._id !== action.payload.id,
        );
      });
  },
});

export default getTotalSlice.reducer;
