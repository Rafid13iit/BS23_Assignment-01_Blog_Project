import { useContext} from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import LoadingSpinner from "../views/components/LoadingSpinner";

const PrivateRoute = ({ children }) => {
  const { isLoggedin, authInitialized } = useContext(AppContext);
  const location = useLocation();

  if (!authInitialized) return <LoadingSpinner />;
  if (!isLoggedin) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default PrivateRoute;