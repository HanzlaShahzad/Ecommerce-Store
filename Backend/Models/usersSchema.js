import mongoose from "mongoose";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";


//User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
  },
  salt: {
    type: String,
    select: false,
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
    select: false,
  },
  verificationTokenExpires: {
    type: Date,
    select: false,
  },
}, {
  timestamps: true,
  toJSON: {
    transform(_document, returnedUser) {
      delete returnedUser.password;
      delete returnedUser.salt;
      delete returnedUser.verificationToken;
      delete returnedUser.verificationTokenExpires;
      delete returnedUser.__v;
      return returnedUser;
    },
  },
});

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
userSchema.static("matchPassword", async function ({ email, password }) {
  const user = await this.findOne({ email: email.trim().toLowerCase() })
    .collation({ locale: "en", strength: 2 })
    .select("+password +salt");

  if (!user || !user.salt || !user.password) return false;

  const hashPassword = createHmac("sha256", user.salt)
    .update(password)
    .digest("hex");

  if (!/^[a-f\d]{64}$/i.test(user.password)) return false;
  return timingSafeEqual(
    Buffer.from(hashPassword, "hex"),
    Buffer.from(user.password, "hex"),
  );
});

//Model
const User = mongoose.model("User", userSchema);
export default User;
