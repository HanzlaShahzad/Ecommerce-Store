import mongoose from "mongoose";
import { createHmac, randomBytes } from "crypto";
import { TokenForUser } from "../Services/authToken.js";


//User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
  },
  role: {
    type: String,
    enum: ["User", "Admin"],
    default: "User",
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  verificationTokenExpires: {
    type: Date,

  }
}, { timestamps: true });

//Hash Password
userSchema.pre("save", function () {
  const user = this;
  if (!user.isModified("password")) { return; }
  const salt = randomBytes(10).toString("hex");
  const hashPassword = createHmac("sha256", salt).update(user.password).digest("hex");
  user.salt = salt;
  user.password = hashPassword;
});

//Signin
userSchema.static("matchPasswordAndCreateToken", async function ({ email, password }) {
  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("User not found by email");
  }

  const hashPassword = createHmac("sha256", user.salt)
    .update(password)
    .digest("hex");

  if (hashPassword !== user.password) {
    throw new Error("Invalid password");
  }

  const token = TokenForUser(user);

  return token;
});

//Model
const User = mongoose.model("User", userSchema);
export default User;
