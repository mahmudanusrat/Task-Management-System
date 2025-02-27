import PropTypes from "prop-types";
import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading)
    return (
      <div>
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  if (user && user?.email) {
    return children;
  }
  return <Navigate to="/login" state={location.pathname } />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.element,
};

export default ProtectedRoute;
