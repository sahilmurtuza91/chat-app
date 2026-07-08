import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PublicRoute({ children }) {
  const user = useSelector((state) => state.user);

  if (user?._id) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
