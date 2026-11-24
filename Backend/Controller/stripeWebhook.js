import stripe from "stripe";
import Order from "../Models/OrderSchema.js";

const Stripe = new stripe(process.env.STRIPE_SECRET_KEY);

export default async function StripeWebhook(req, res) {
  try {
    const signature = req.headers["stripe-signature"];

    const event = Stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.WEBHOOK_SECRET_KEY
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: "Order ID missing from Stripe metadata",
        });
      }

      if (session.payment_status === "paid") {
        const updatedOrder = await Order.findOneAndUpdate(
          {
            _id: orderId,
            user: session.metadata?.userId,
            stripeSessionId: session.id,
            paymentStatus: { $ne: "paid" },
          },
          {
            paymentStatus: "paid",
            orderStatus: "confirmed",
            stripeSessionId: session.id,
            paymentDate: new Date(),
          },
          { new: true }
        );

        if (!updatedOrder) {
          const alreadyProcessed = await Order.exists({
            _id: orderId,
            user: session.metadata?.userId,
            stripeSessionId: session.id,
            paymentStatus: "paid",
          });
          if (!alreadyProcessed) {
            return res.status(500).json({
              success: false,
              message: "Unable to update the paid order.",
            });
          }
        }
      }
    }

    return res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error("Stripe webhook failed:", error.message);

    const statusCode =
      error.type === "StripeSignatureVerificationError" ? 400 : 500;
    return res.status(statusCode).json({
      success: false,
      message: "Unable to process Stripe webhook.",
    });
  }
}