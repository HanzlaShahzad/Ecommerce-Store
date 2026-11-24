import Order from "../Models/OrderSchema.js";

export default async function markOrderPaid({ orderId, userId, sessionId }) {
  const orderFilter = {
    _id: orderId,
    user: userId,
    stripeSessionId: sessionId,
  };
  const updatedOrder = await Order.findOneAndUpdate(
    {
      ...orderFilter,
      paymentStatus: { $ne: "paid" },
    },
    {
      $set: {
        paymentStatus: "paid",
        orderStatus: "confirmed",
        paymentDate: new Date(),
      },
    },
    { new: true },
  );

  if (updatedOrder) {
    return true;
  }

  return Boolean(
    await Order.exists({
      ...orderFilter,
      paymentStatus: "paid",
    }),
  );
}
