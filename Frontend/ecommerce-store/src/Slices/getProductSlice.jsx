import { createSlice } from "@reduxjs/toolkit";
import { deleteProductThunk, getProductThunk } from "../Thunks/productThunk";

export const getProductSlice = createSlice({
  name: "getProducts",
  initialState: {
    data: [],
    searchItem: "",
    pending: false,
    error: false,
  },
  reducers: {
    setSearchItem: (state, action) => {
      state.searchItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductThunk.pending, (state) => {
        state.error = false;
        state.pending = true;
      })
      .addCase(getProductThunk.rejected, (state) => {
        state.pending = false;
        state.error = true;
      })
      .addCase(getProductThunk.fulfilled, (state, action) => {
        state.error = false;
        state.pending = false;
        state.data = action.payload;
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (product) => product._id !== action.payload,
        );
      });
  },
});
export const { setSearchItem } = getProductSlice.actions;
export default getProductSlice.reducer;
