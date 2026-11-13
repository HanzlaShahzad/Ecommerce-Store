import { randomBytes } from "crypto";
import User from "../Models/usersSchema.js";
import sendEmailVerification from "./sendEmail.js";

export const ResendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    console.log("=================================");
    console.log("RESEND EMAIL RECEIVED:", email);
    console.log("REQUEST BODY:", req.body);
    console.log("=================================");

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
    console.log("Resend Verification Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};