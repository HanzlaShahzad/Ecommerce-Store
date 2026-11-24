import stripe from "stripe";
import markOrderPaid from "../Utils/markOrderPaid.js";

const Stripe = new stripe(process.env.STRIPE_SECRET_KEY);

export default async function StripeWebhook(req, res) {
  try {
    const signature = req.headers["stripe-signature"];

    const event = Stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.WEBHOOK_SECRET_KEY
    );

    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      const userId = session.metadata?.userId;

      if (!orderId || !userId) {
        return res.status(400).json({
          success: false,
          message: "Order details missing from Stripe metadata",
        });
      }

      if (session.payment_status === "paid") {
        const orderUpdated = await markOrderPaid({
          orderId,
          userId,
          sessionId: session.id,
        });
        if (!orderUpdated) {
          return res.status(500).json({
            success: false,
            message: "Unable to update the paid order.",
          });
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