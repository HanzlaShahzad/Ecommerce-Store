import User from "../Models/usersSchema.js";
import { VerifyToken } from "./authToken.js";

export default async function AuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header not found",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = VerifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(403).json({ success: false, msg: "user not found" });
    }
    req.user = user;

    next();
  } catch (error) {
    console.log("ERROR NAME:", error.name);
    console.log("ERROR MESSAGE:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}