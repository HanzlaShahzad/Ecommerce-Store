import Order from "../Models/OrderSchema.js";
import mongoose from "mongoose";
import Products from "../Models/productsSchema.js";
import { normalizeMongoId } from "../Utils/mongoId.js";

const DELIVERY_FEE = 200;

export const OrderController = async (req, res) => {
  try {
    const { cartItems } = req.body || {};
    if (!Array.isArray(cartItems) || cartItems.length === 0 || cartItems.length > 50) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const requestedQuantities = new Map();
    for (const item of cartItems) {
      const productId = normalizeMongoId(item?.product ?? item?._id);
      const cartQuantity = Number(item?.cartQuantity);

      if (
        !mongoose.Types.ObjectId.isValid(productId) ||
        !Number.isInteger(cartQuantity) ||
        cartQuantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Cart contains an invalid product or quantity.",
        });
      }

      const combinedQuantity = (requestedQuantities.get(productId) || 0) + cartQuantity;
      if (combinedQuantity > 100) {
        return res.status(400).json({
          success: false,
          message: "A product quantity exceeds the order limit.",
        });
      }
      requestedQuantities.set(productId, combinedQuantity);
    }

    const requestedItems = [...requestedQuantities].map(([product, cartQuantity]) => ({
      product,
      cartQuantity,
    }));
    const productIds = [...requestedQuantities.keys()];
    const products = await Products.find({
      _id: { $in: productIds },
      deleted: { $ne: true },
      status: "Active",
    });
    const productsById = new Map(products.map((product) => [product._id.toString(), product]));

    if (productsById.size !== productIds.length) {
      return res.status(409).json({
        success: false,
        message: "One or more products are unavailable.",
      });
    }

    let subtotal = 0;
    for (const item of requestedItems) {
      const product = productsById.get(item.product);
      if (item.cartQuantity > product.quantity) {
        return res.status(409).json({
          success: false,
          message: `${product.name} does not have enough stock.`,
        });
      }

      const discount = Math.min(100, Math.max(0, Number(product.discount) || 0));
      const unitPrice = Number(product.price) * (1 - discount / 100);
      if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        return res.status(500).json({
          success: false,
          message: "A product has invalid pricing.",
        });
      }
      item.unitPrice = Math.round(unitPrice * 100) / 100;
      subtotal += item.unitPrice * item.cartQuantity;
    }

    const totalPrice = Math.round((subtotal + DELIVERY_FEE) * 100) / 100;
    const order = await Order.create({
      user: req.user._id,
      cartItems: requestedItems,
      totalPrice,
      paymentStatus: "unpaid",
      orderStatus: "pending",
    });
    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Order creation failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to create the order.",
    });
  }
};


export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate({
        path: "user",
        select: "name username",
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
    console.error("Find orders failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load orders.",
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID." });
    }

    const orders = await Order.find({ user: id })
      .populate({ path: "user", select: "name username" })
      .populate({
        path: "cartItems.product",
        select: "name price description image quantity discount status",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Find user orders failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to load user orders.",
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
    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Find all orders failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load orders.",
    });
  }
};

export const getOneOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid order ID." });
    }

    const specificOrder = await Order.findById(id)
      .populate({ path: "user", select: "name username" })
      .populate("cartItems.product");
    return res.status(200).json({ success: true, specificOrder });
  } catch (error) {
    console.error("Find order failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to load the order.",
    });
  }
};

export const deleteOrders = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid order ID." });
    }

    const deletedOrder = await Order.findOneAndDelete({
      _id: id,
      paymentStatus: { $ne: "paid" },
      stripeSessionId: { $exists: false },
    });

    if (!deletedOrder && !(await Order.exists({ _id: id }))) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (!deletedOrder) {
      return res.status(409).json({
        success: false,
        message: "An order with a payment session or completed payment cannot be deleted.",
      });
    }

    return res.status(200).json({ success: true, id: deletedOrder._id });
  } catch (error) {
    console.error("Delete order failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to delete order.",
    });
  }
};

