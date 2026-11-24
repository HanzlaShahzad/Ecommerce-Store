import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { isSessionTokenValid } from "../utils/auth";

export default function ProtectedRoute({
  children,
  allowedRoles = ["Admin"],
}) {
  const { data, token } = useSelector((state) => state.signin);
  const location = useLocation();
  const user = data?.user;
  const tokenIsValid = isSessionTokenValid(token);

  useEffect(() => {
    if (!tokenIsValid) localStorage.removeItem("token");
  }, [tokenIsValid]);

  if (!tokenIsValid || !user) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
