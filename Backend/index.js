
import "dotenv/config";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

import router from "./Routes/router.js";
import StripeWebhook from "./Controller/stripeWebhook.js";

const app = express();

const backendDirectory = path.dirname(fileURLToPath(import.meta.url));

// 1. CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL?.trim().replace(/\/+$/, ""),
  "https://shop-nest.hanzlashahzad41.workers.dev",
  "http://localhost:5173"
].filter(Boolean);



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

// 2. MongoDB connection (reused between serverless requests)
let mongoConnectionPromise;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is missing");
  }

  if (!mongoConnectionPromise) {
    mongoConnectionPromise = mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        console.log("MongoDB Connected Successfully");
      })
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

// 3. Connect to MongoDB before handling API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// 4. Stripe webhook (raw body must come before express.json)
app.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  StripeWebhook
);

// 5. JSON middleware
app.use(express.json());

// 6. Static uploads
app.use(
  "/uploads",
  express.static(path.join(backendDirectory, "uploads"))
);

// 7. Application routes
app.use("/", router);

// 8. Error handling
app.use((error, req, res, next) => {
  console.error("API Error:", error.message);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// 9. Export Express application for Vercel
app.listen(2000, () => console.log("Port Running"));
export default app;
