import { randomBytes } from "crypto";
import User from "../Models/usersSchema.js";
import { TokenForUser } from "../Services/authToken.js";
import sendVerificationEmail from "../Utils/sendEmail.js";

// ===============================
// Create User / Signup
// ===============================
export const UserController = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    console.log("=================================");
    console.log("EMAIL RECEIVED FROM FRONTEND:", email);
    console.log("REQUEST BODY:", req.body);
    console.log("=================================");

    const verificationToken = randomBytes(32).toString("hex");

    const verificationTokenExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    // Check name and username
    if (name === username) {
      return res.status(400).json({
        success: false,
        message:
          "Name and username cannot be the same. Please change your name or username.",
      });
    }

    // Validate email
    const emailRegex =
      /^[A-Za-z0-9]+([.-][A-Za-z0-9]+)*@[A-Za-z0-9]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Create user
    const user = await User.create({
      name,
      username,
      email,
      password,

      // Email verification fields
      emailVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    console.log("User created:", user._id);
    console.log("Email verified:", user.emailVerified);
    console.log("Verification token:", verificationToken);

    return res.status(201).json({
      success: true,
      user,
      message:
        "Account created successfully. Please check your email to verify your account.",
    });
  } catch (error) {
    console.log("User Creation Error =>", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// Signin
// ===============================
export const Signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // 2. Check email verification FIRST
    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before signing in.",
      });
    }

    // 3. Check password
    const userMatchPassword =
      await User.matchPasswordAndCreateToken({
        email,
        password,
      });

    // 4. Generate JWT token
    const token = TokenForUser(user);

    return res.status(200).json({
      success: true,
      userMatchPassword,
      user,
      token,
      emailVerified: true,
      message: "Successfully signed in.",
    });
  } catch (error) {
    console.log("Signin Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// Get Users
// ===============================
export const GetUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "user",
          as: "orders",
        },
      },
      {
        $addFields: {
          orderCount: { $size: "$orders" },
        },
      },
      {
        $project: {
          password: 0,
          orders: 0,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log("Get Users Error =>", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
