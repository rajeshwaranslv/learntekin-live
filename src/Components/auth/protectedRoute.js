// ProtectedRoute.js
import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuth } from "./authContext";

function ProtectedRoute({ component: Component, ...rest }) {
  const { currentUser, loading } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        loading ? (
          <div className="route-loader">Checking your session...</div>
        ) : 
        currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect to="/unauthorized" />
        )
      }
    />
  );
}

export default ProtectedRoute;
