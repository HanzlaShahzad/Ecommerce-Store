import stripe from "stripe";

const Stripe = new stripe(process.env.STRIPE_SECRET_KEY);

export default async function createCheckoutSession(req, res) {
  try {
    const { cartItems, orderId } = req.body;

    console.log("cartItems :", cartItems);
    console.log("orderId :", orderId);

    if (!orderId) {
      res.status(400).json("order is missing");
    }

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        msg: "Products will not be found",
      });
    }

    const line_items = cartItems.map((product) => {
      const price = Number(product.price) || 0;
      const discount = Number(product.discount) || 0;

      // Quantity of THIS product
      const quantity = Number(product.quantity) || 1;

      // Discounted price
      const totalPrice = price - (price * discount) / 100;
      const annualPrice = totalPrice;

      return {
        price_data: {
          currency: "pkr",

          product_data: {
            name: product.name,

            images: product.image
              ? [`http://localhost:2000/uploads/${product.image}`]
              : [],
          },

          // Stripe expects amount in smallest currency unit
          unit_amount: Math.round(annualPrice * 100),
        },

        // IMPORTANT:
        // This is the quantity of this individual product
        quantity: quantity,
      };
    });
    const shipping = 200;
    line_items.push({
      price_data: {
        currency: "pkr",
        product_data: {
          name: "Standard Delivery",
        },
        unit_amount: Math.round(shipping * 100),
      },
      quantity: 1,

    });

    const session = await Stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: line_items,

      mode: "payment",

      metadata: {
        orderId: orderId.toString(),
      },

      success_url: "http://localhost:5173/success",

      cancel_url: "http://localhost:5173/cancel",
    });

    return res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.log("Stripe_Error :", error);

    return res.status(400).json({
      error: error.message,
    });
  }
}
