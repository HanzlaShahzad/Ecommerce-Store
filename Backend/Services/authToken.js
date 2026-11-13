import JWT from "jsonwebtoken";

export const TokenForUser = (user) => {
  const saveToken = JWT.sign({ id: user._id, email: user.email },
    process.env.SECRET);
  return saveToken;
};

export const VerifyToken = (token) => {
  const verification = JWT.verify(token, process.env.SECRET);
  return verification;
}