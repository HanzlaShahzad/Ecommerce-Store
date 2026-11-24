import { createSlice } from "@reduxjs/toolkit";
import { deleteOrder, specificOrder } from "../Thunks/stripeThunk";

export const getSpecificOrderSlice = createSlice({
  name: "specificOrder",
  initialState: {
    order: [],
    pending: false,
    error: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(specificOrder.pending, (state) => {
        state.error = false;
        state.pending = true;
      })
      .addCase(specificOrder.rejected, (state) => {
        state.pending = false;
        state.error = true;
      })
      .addCase(specificOrder.fulfilled, (state, action) => {
        state.error = false;
        state.pending = false;
        state.order = action.payload;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        if (state.order?._id === action.payload.id) {
          state.order = null;
        }
      });
  },
});

export default getSpecificOrderSlice.reducer;
