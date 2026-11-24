import { createSlice } from "@reduxjs/toolkit";
import { normalizeMongoId } from "../utils/mongoId";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
  },

  reducers: {
    // ADD PRODUCT
    addToCart: (state, action) => {
      const product = action.payload;
      const productId = normalizeMongoId(product?._id);
      if (!productId) return;

      const stockQuantity = Number(product.quantity) || 0;

      const existingProduct = state.cartItems.find(
        (item) => normalizeMongoId(item._id) === productId,
      );

      // Product already exists
      if (existingProduct) {
        if (existingProduct.cartQuantity >= stockQuantity) {
          return;
        }

        existingProduct.cartQuantity += 1;
        return;
      }

      // New product
      state.cartItems.push({
        ...product,
        _id: productId,
        cartQuantity: 1,
      });
    },

    // INCREASE QUANTITY
    increaseQuantitys: (state, action) => {
      const id = normalizeMongoId(action.payload);

      const product = state.cartItems.find(
        (item) => normalizeMongoId(item._id) === id,
      );

      if (!product) return;

      const stockQuantity = Number(product.quantity) || 0;

      // Don't exceed available stock
      if (product.cartQuantity >= stockQuantity) {
        return;
      }

      product.cartQuantity += 1;
    },

    // DECREASE QUANTITY
    decreaseQuantitys: (state, action) => {
      const id = normalizeMongoId(action.payload);

      const product = state.cartItems.find(
        (item) => normalizeMongoId(item._id) === id,
      );

      if (!product) return;

      product.cartQuantity -= 1;

      // Remove product when quantity reaches 0
      if (product.cartQuantity <= 0) {
        state.cartItems = state.cartItems.filter(
          (item) => normalizeMongoId(item._id) !== id,
        );
      }
    },

    // REMOVE PRODUCT
    removeFromCarts: (state, action) => {
      const id = normalizeMongoId(action.payload);

      state.cartItems = state.cartItems.filter(
        (item) => normalizeMongoId(item._id) !== id,
      );
    },

    // CLEAR CART
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const {
  addToCart,
  increaseQuantitys,
  decreaseQuantitys,
  removeFromCarts,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
