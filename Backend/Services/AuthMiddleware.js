import User from "../Models/usersSchema.js";
import mongoose from "mongoose";
import { VerifyToken } from "./authToken.js";

export default async function AuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "A valid Bearer token is required.",
      });
    }

    const token = authHeader.slice("Bearer ".length).trim();
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "A valid Bearer token is required.",
      });
    }
    const decoded = VerifyToken(token);
    if (
      !mongoose.Types.ObjectId.isValid(decoded.id) ||
      !Number.isInteger(decoded.exp)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "The account for this token no longer exists.",
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}