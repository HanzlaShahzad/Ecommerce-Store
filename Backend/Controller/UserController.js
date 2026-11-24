import { randomBytes } from "crypto";
import User from "../Models/usersSchema.js";
import { TokenForUser } from "../Services/authToken.js";
import sendVerificationEmail from "../Utils/sendEmail.js";

// ===============================
// Create User / Signup
// ===============================
export const UserController = async (req, res) => {
  let accountCreated = false;
  try {
    const { name, username, email, password } = req.body || {};
    const normalizedName = typeof name === "string" ? name.trim() : "";
    const normalizedUsername = typeof username === "string" ? username.trim() : "";
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (
      !normalizedName ||
      !normalizedUsername ||
      !normalizedEmail ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, username, valid email, and a password of at least 8 characters are required.",
      });
    }

    const verificationToken = randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

    // Check name and username
    if (normalizedName.toLowerCase() === normalizedUsername.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message:
          "Name and username cannot be the same. Please change your name or username.",
      });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: normalizedEmail })
      .collation({ locale: "en", strength: 2 });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Create user
    const user = await User.create({
      name: normalizedName,
      username: normalizedUsername,
      email: normalizedEmail,
      password,

      // Email verification fields
      emailVerified: false,
      verificationToken,
      verificationTokenExpires,
    });
    accountCreated = true;

    // Send verification email
    await sendVerificationEmail(normalizedEmail, verificationToken);

    return res.status(201).json({
      success: true,
      user,
      message:
        "Account created successfully. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("User creation failed:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with that email or username already exists.",
      });
    }

    if (accountCreated) {
      return res.status(503).json({
        success: false,
        accountCreated: true,
        message:
          "Your account was created, but the verification email could not be sent. Check the email service settings, then resend the verification email.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create your account right now.",
    });
  }
};


// ===============================
// Signin
// ===============================
export const Signin = async (req, res) => {
  try {
    const body = req.body || {};
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = body.password;
    if (!email || typeof password !== "string" || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // 1. Find user
    const user = await User.findOne({ email })
      .collation({ locale: "en", strength: 2 });

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
    const passwordMatches = await User.matchPassword({ email, password });
    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Email or password is incorrect.",
      });
    }

    // 4. Generate JWT token
    const token = TokenForUser(user);

    return res.status(200).json({
      success: true,
      user,
      token,
      emailVerified: true,
      message: "Successfully signed in.",
    });
  } catch (error) {
    console.error("Signin failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to sign in right now.",
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
          salt: 0,
          verificationToken: 0,
          verificationTokenExpires: 0,
          orders: 0,
          __v: 0,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get users failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load users.",
    });
  }
};
