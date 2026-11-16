
import "dotenv/config";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import router from "./Routes/router.js";
import StripeWebhook from "./Controller/stripeWebhook.js";

const app = express();

// 1. CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 2. MongoDB connection (reused between requests)
let mongoConnectionPromise;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!mongoConnectionPromise) {
    mongoConnectionPromise = mongoose
      .connect(process.env.MONGO_URI).then(() => console.log('MongoDB Connected Successfuly'))
      .catch((error) => {
        mongoConnectionPromise = null;
        throw error;
      });
  }

  await mongoConnectionPromise;
};

mongoose.connection.on("disconnected", () => {
  mongoConnectionPromise = null;
});

// Connect before handling API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// 3. Stripe webhook (raw body must come before express.json)
app.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  StripeWebhook
);

// 4. JSON middleware
app.use(express.json());

// 5. Application routes
app.use("/", router);

// 6. Error handling
app.use((error, req, res, next) => {
  console.error("API Error:", error);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

app.listen(2000);

// 7. Export Express application for Vercel
export default app;
