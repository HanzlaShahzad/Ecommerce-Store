import { createSlice } from "@reduxjs/toolkit";
import { createOrder } from "../Thunks/stripeThunk";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    data: [],
    error: false,
    pending: false,
  },
  extraReducers: (builder) => {
    (builder.addCase(createOrder.rejected, (state) => {
      state.pending = false;
      state.error = true;
    }),
      builder.addCase(createOrder.pending, (state) => {
        state.error = false;
        state.pending = true;
      }),
      builder.addCase(createOrder.fulfilled, (state, action) => {
        state.pending = false;
        state.error = false;
        state.data = action.payload;
      }));
  },
});
export default orderSlice.reducer;
