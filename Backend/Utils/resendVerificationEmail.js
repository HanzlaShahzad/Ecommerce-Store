import { randomBytes } from "crypto";
import User from "../Models/usersSchema.js";
import sendEmailVerification from "./sendEmail.js";

export const ResendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid email address is required.",
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() })
      .collation({ locale: "en", strength: 2 })
      .select("+verificationToken +verificationTokenExpires");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified.",
      });
    }

    const verificationToken = randomBytes(32).toString("hex");

    const verificationTokenExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;

    await user.save();

    await sendEmailVerification(email, verificationToken);

    return res.status(200).json({
      success: true,
      message: "A new verification email has been sent.",
    });
  } catch (error) {
    console.error("Resend verification failed:", error.message);

    return res.status(503).json({
      success: false,
      message: "The verification email could not be sent. Please try again later.",
    });
  }
};