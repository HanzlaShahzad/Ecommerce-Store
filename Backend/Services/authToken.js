import JWT from "jsonwebtoken";

export const TokenForUser = (user) => {
  if (!process.env.SECRET) {
    throw new Error("SECRET must be configured before issuing authentication tokens.");
  }

  return JWT.sign(
    { id: user._id.toString(), email: user.email },
    process.env.SECRET,
    { expiresIn: "1d" },
  );
};

export const VerifyToken = (token) => {
  if (!process.env.SECRET) {
    throw new Error("SECRET must be configured before verifying authentication tokens.");
  }

  return JWT.verify(token, process.env.SECRET);
}