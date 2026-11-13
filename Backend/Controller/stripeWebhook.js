import stripe from "stripe";
import Order from "../Models/OrderSchema.js";

const Stripe = new stripe(process.env.STRIPE_SECRET_KEY);

export default async function StripeWebhook(req, res) {
  try {
    console.log("🔥 WEBHOOK ROUTE HIT");
    const signature = req.headers["stripe-signature"];

    const event = Stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.WEBHOOK_SECRET_KEY
    );

    console.log("WEBHOOK EVENT =====>", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      console.log("SESSION ID =====>", session.id);
      console.log("METADATA =====>", session.metadata);
      console.log("PAYMENT STATUS =====>", session.payment_status);

      const orderId = session.metadata?.orderId;

      console.log("ORDER ID FROM WEBHOOK =====>", orderId);

      if (!orderId) {
        console.log("❌ ORDER ID IS MISSING");
        return res.status(400).json({
          success: false,
          message: "Order ID missing from Stripe metadata",
        });
      }

      if (session.payment_status === "paid") {
        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          {
            paymentStatus: "paid",
            orderStatus: "confirmed",
            stripeSessionId: session.id,
            paymentDate: new Date(),
          },
          { new: true }
        );

        console.log("UPDATED ORDER =====>", updatedOrder);

        if (!updatedOrder) {
          console.log("❌ ORDER NOT FOUND IN MONGODB");
        } else {
          console.log("✅ ORDER MARKED AS PAID");
        }
      }
    }

    return res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.log("❌ Stripe Webhook Error:", error.message);

    return res.status(400).json({
      error: error.message,
    });
  }
}