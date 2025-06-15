import Main from "./Main.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import Sidebar from "./Sidebar.jsx";
import Login from "../../pages/login/Login.jsx";
import Signup from "../../pages/login/Signup.jsx";
import React, { useEffect } from "react";
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

const Layout = () => {
  const isAuthenticated = useSelector(state => state.authentication.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation(); // Get current path

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== "/signup") {
      navigate("/login");
    }
  }, [isAuthenticated,location,  navigate]);

  return (
    <>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <>
          <Sidebar />
          <div className="admin_body">
            <Navbar />
            <Main />
            <Footer />
          </div>
        </>
      )}
    </>
  );
};

export default Layout;
