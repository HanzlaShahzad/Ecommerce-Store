import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
  },

  reducers: {
    // ADD PRODUCT
    addToCart: (state, action) => {
      const product = action.payload;

      const stockQuantity = Number(product.quantity) || 0;

      const existingProduct = state.cartItems.find(
        (item) => item._id === product._id,
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
        cartQuantity: 1,
      });
    },

    // INCREASE QUANTITY
    increaseQuantitys: (state, action) => {
      const id = action.payload;

      const product = state.cartItems.find((item) => item._id === id);

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
      const id = action.payload;

      const product = state.cartItems.find((item) => item._id === id);

      if (!product) return;

      product.cartQuantity -= 1;

      // Remove product when quantity reaches 0
      if (product.cartQuantity <= 0) {
        state.cartItems = state.cartItems.filter((item) => item._id !== id);
      }
    },

    // REMOVE PRODUCT
    removeFromCarts: (state, action) => {
      const id = action.payload;

      state.cartItems = state.cartItems.filter((item) => item._id !== id);
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
