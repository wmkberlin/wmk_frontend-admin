import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ element, ...rest }) => {
  const isAuthenticated = useSelector(state => state.authentication.isAuthenticated);
  const { productId } = useParams(); 
  return isAuthenticated ? React.cloneElement(element, { key: productId, ...rest }) : <Navigate to="/login" />;
};

export default PrivateRoute;
