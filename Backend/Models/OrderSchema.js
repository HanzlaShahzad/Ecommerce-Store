import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
        },
        cartQuantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        unitPrice: {
          type: Number,
          min: 0,
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentStatus: {
      type: String,
      default: "unpaid",
    },

    orderStatus: {
      type: String,
      default: "pending",
    },
    stripeSessionId: {
      type: String,
    },

    paymentDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;