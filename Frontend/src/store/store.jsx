import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storageModule from "redux-persist/lib/storage";
import signupReducer from "../Slices/signupSlice.jsx";
import signinReducer from "../Slices/signinSlice.jsx";
import createProductsReducer from "../Slices/createProductSlice.jsx";
import getProductsReducer from "../Slices/getProductSlice.jsx";
import getUserReducer from "../Slices/getUsersSlice.jsx";
import getOrdersReducer from "../Slices/getOrderSlice.jsx";
import cartReducer from "../Slices/cartSlice.jsx";
import totalOrdersReducer from "../Slices/totalOrder.jsx";
import specificOrderReducer from "../Slices/specificOrder.jsx";
const storage = storageModule.default;

const obj = {
  key: "root",
  storage,
};

const reducer = combineReducers({
  signup: signupReducer,
  signin: signinReducer,
  getUser: getUserReducer,
  createProducts: createProductsReducer,
  getProducts: getProductsReducer,
  getOrders: getOrdersReducer,
  cart: cartReducer,
  totalOrders: totalOrdersReducer,
  specificOrder: specificOrderReducer,
});
const persisReducers = persistReducer(obj, reducer);

export const store = configureStore({
  reducer: persisReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
