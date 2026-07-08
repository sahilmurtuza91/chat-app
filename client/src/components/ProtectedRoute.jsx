import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.user);

  if (!user?._id) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;
