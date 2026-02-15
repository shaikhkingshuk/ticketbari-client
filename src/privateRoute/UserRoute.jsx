import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../context/AuthContext";

const UserRoute = ({ children }) => {
  const { user, role, loading, refreshRole } = useContext(AuthContext);
  const location = useLocation();
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (user) {
        await refreshRole();
      }
      setCheckingRole(false);
    };

    check();
  }, [location.pathname, user, refreshRole]);

  if (loading || checkingRole) {
    return <span className="loading loading-dots loading-xl"></span>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role !== "user") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default UserRoute;
