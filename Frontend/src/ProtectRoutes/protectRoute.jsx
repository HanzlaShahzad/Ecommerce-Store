import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { data } = useSelector((state) => state.signin);

  if (data?.user?.role === "Admin") {
    return children;
  } else {
    return <Navigate to="/" replace></Navigate>;
  }
}
