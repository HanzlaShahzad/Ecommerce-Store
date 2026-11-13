import "dotenv/config";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";

import router from "./Routes/router.js";
import StripeWebhook from "./Controller/stripeWebhook.js";

const app = express();


app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


app.post(
  "/stripe-webhook",
  express.raw({
    type: "application/json",
  }),
  StripeWebhook
);


app.use(express.json());


app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads")
  )
);
app.use("/", router);


mongoose
  .connect("mongodb://127.0.0.1:27017/ecommerce-store")
  .then(() => {
    console.log("=================================");
    console.log("Mongoose Connected");
    console.log("=================================");
  })
  .catch((error) => {
    console.log(
      "Mongoose Connection Error =>",
      error
    );
  });


app.listen(2000, () => {
  console.log("=================================");
  console.log("Server running on port 2000");
  console.log("http://localhost:2000");
  console.log("=================================");
});