import stripe from "stripe";
import mongoose from "mongoose";
import Order from "../Models/OrderSchema.js";
import { normalizeMongoId } from "../Utils/mongoId.js";
import markOrderPaid from "../Utils/markOrderPaid.js";
import getClientUrl from "../Utils/clientUrl.js";

const Stripe = new stripe(process.env.STRIPE_SECRET_KEY);
const DELIVERY_FEE = 200;

export default async function createCheckoutSession(req, res) {
  try {
    const orderId = normalizeMongoId(req.body?.orderId);
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ success: false, message: "Invalid order ID." });
    }

    const clientUrl = getClientUrl();

    const order = await Order.findById(orderId).populate({
      path: "cartItems.product",
      select: "name price discount image quantity status deleted",
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You cannot pay for this order." });
    }

    if (order.paymentStatus === "paid") {
      return res.status(409).json({ success: false, message: "This order is already paid." });
    }

    const lineItems = [];
    let subtotal = 0;

    for (const item of order.cartItems) {
      const product = item.product;
      if (!product || product.deleted || product.status !== "Active") {
        return res.status(409).json({
          success: false,
          message: "A product in this order is no longer available.",
        });
      }

      const quantity = Number(item.cartQuantity);
      if (quantity > product.quantity) {
        return res.status(409).json({
          success: false,
          message: `${product.name} no longer has enough stock.`,
        });
      }
      const currentDiscount = Math.min(100, Math.max(0, Number(product.discount) || 0));
      const currentPrice = Number(product.price) * (1 - currentDiscount / 100);
      const unitPrice = Number.isFinite(item.unitPrice) ? item.unitPrice : currentPrice;
      const unitAmount = Math.round(unitPrice * 100);

      if (!Number.isInteger(quantity) || quantity < 1 || !Number.isInteger(unitAmount) || unitAmount < 1) {
        return res.status(400).json({
          success: false,
          message: "The order contains invalid product pricing or quantity.",
        });
      }

      subtotal += (unitAmount * quantity) / 100;
      lineItems.push({
        price_data: {
          currency: "pkr",
          product_data: {
            name: product.name,
            images: product.image && /^https?:\/\//i.test(product.image)
              ? [product.image]
              : [],
          },
          unit_amount: unitAmount,
        },
        quantity,
      });
    }

    if (lineItems.length === 0) {
      return res.status(400).json({ success: false, message: "The order has no products." });
    }

    lineItems.push({
      price_data: {
        currency: "pkr",
        product_data: { name: "Standard Delivery" },
        unit_amount: DELIVERY_FEE * 100,
      },
      quantity: 1,
    });

    order.totalPrice = Math.round((subtotal + DELIVERY_FEE) * 100) / 100;
    const session = await Stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
      },
      success_url: `${clientUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/cancel`,
    });

    order.stripeSessionId = session.id;
    await order.save();

    return res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe checkout creation failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to start secure checkout.",
    });
  }
}

export async function getCheckoutSessionStatus(req, res) {
  try {
    const session = await Stripe.checkout.sessions.retrieve(req.params.sessionId);
    const orderId = session.metadata?.orderId;
    const userId = session.metadata?.userId;
    if (!orderId || userId !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        message: "Checkout session not found.",
      });
    }

    const paid = session.payment_status === "paid";
    if (paid) {
      const orderUpdated = await markOrderPaid({
        orderId,
        userId,
        sessionId: session.id,
      });
      if (!orderUpdated) {
        return res.status(409).json({
          success: false,
          message: "Payment is confirmed, but the order could not be updated. Please contact support.",
        });
      }
    }

    return res.status(200).json({
      success: true,
      paid,
      orderId,
    });
  } catch (error) {
    console.error("Stripe session verification failed:", error.message);
    return res.status(400).json({
      success: false,
      message: "Unable to verify the payment session.",
    });
  }
}
