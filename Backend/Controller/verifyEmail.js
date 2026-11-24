import User from "../Models/usersSchema.js";

export default async function verifyEmail(req, res) {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is missing.",
      });
    }

    const user = await User.findOne({
      verificationToken: token,
    }).select("+verificationToken +verificationTokenExpires");

    // Token does not exist
    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid verification link. Please request a new verification email.",
      });
    }

    // IMPORTANT:
    // If the email was already verified,
    // don't show "invalid token".
    if (user.emailVerified) {
      return res.status(200).json({
        success: true,
        alreadyVerified: true,
        message: "Your email is already verified.",
      });
    }

    // Check token expiry
    if (
      !user.verificationTokenExpires ||
      user.verificationTokenExpires < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Verification link has expired. Please request a new verification email.",
      });
    }

    // Verify email
    user.emailVerified = true;

    // Don't delete verificationToken here
    // This allows an already-used link to be recognized.

    await user.save();

    return res.status(200).json({
      success: true,
      alreadyVerified: false,
      message: "Email verified successfully.",
    });

  } catch (error) {
    console.error("Email verification failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Email verification failed.",
    });
  }
}
