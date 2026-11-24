import Order from "../Models/OrderSchema.js";
import mongoose from "mongoose";
import { normalizeMongoId } from "../Utils/mongoId.js";

export const OrderController = async (req, res) => {
  try {
    const { cartItems, totalPrice } = req.body;
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const formattedCartItems = cartItems.map((item) => {
      const productId = normalizeMongoId(item?.product ?? item?._id);
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return null;
      }

      return {
        product: productId,
        cartQuantity: Math.max(1, Number(item.cartQuantity) || 1),
      };
    });

    if (formattedCartItems.some((item) => item === null)) {
      return res.status(400).json({ success: false, message: "Cart contains an invalid product ID" });
    }

    if (!Number.isFinite(Number(totalPrice)) || Number(totalPrice) < 0) {
      return res.status(400).json({ success: false, message: "Invalid order total" });
    }

    const order = await Order.create({
      user: req.user._id,
      cartItems: formattedCartItems,
      totalPrice: Number(totalPrice),
      paymentStatus: "unpaid",
      orderStatus: "pending",
    });
    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.log("Order controller Error :", error);
    return res.status(400).json({ error });
  }
};


export const getMyOrders = async (req, res) => {
  try {
    const { id } = req.params;


    const orders = await Order.find({ user: id })
      .populate({
        path: "user",
        select: "name username email role",
      })
      .populate({
        path: "cartItems.product",
        select: "name price description image quantity discount status",
      })
      .sort({ createdAt: -1 });


    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log("Find Orders Error:", error);

    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
export const totalOrders = async (req, res) => {
  try {

    const orders = await Order.find({})
      .populate({
        path: "user",
        select: "name username email role",
      })
      .populate({
        path: "cartItems.product",
        select: "name price description image quantity discount status",
      })
      .sort({ createdAt: -1 });
    console.log("=================================");
    console.log("TOTAL ORDERS COUNT =>", orders.length);
    console.log("TOTAL ORDERS =>", orders);
    console.log("=================================");

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log("Find Orders Error:", error);

    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const getOneOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const specificOrder = await Order.findById(id).populate("user")
      .populate("cartItems.product");
    return res.status(200).json({ success: true, specificOrder });
  } catch (error) {
    console.log("specific order error ===>", error)
    return res.status(500).json({ success: true, error });
  }
};

export const deleteOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, deletedOrder });
  } catch (error) {
    console.log("deleteOrder ===>", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

