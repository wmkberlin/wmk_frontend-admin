import * as Icons from "react-icons/tb";
import React, { useState, useEffect } from "react";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import Logo from "../../images/logo.webp";
import { useNavigate, Link } from "react-router-dom";
import bcrypt from "bcryptjs";
import { ToastContainer, toast } from 'react-toastify';


const API_URL = "https://wmk-backend.onrender.com/api/auth/admin/signup"; 

const Signup = ({ isLogin }) => {
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    Cpassword: "",
  });

  const handleInputChange = (fieldName, newValue) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: newValue,
    }));
  };

  const [isRemember, setIsRemember] = useState(false);
  const handleRememberChange = (check) => setIsRemember(check);

  const [show, setShow] = useState(false);
  const handleShowPassword = () => setShow(!show);

  // Function to handle API call
  const handleSignup = async (e) => {
    e.preventDefault();

    // Basic Form Validation
    if (
      !formData.email ||
      !formData.username ||
      !formData.password ||
      !formData.Cpassword
    ) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (formData.password !== formData.Cpassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true); // Show loading state

    try {
		const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(formData.password, salt);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
			email_address: formData.email,
          name: formData.username,
          password: hashedPassword,
		  phone_number: 137841398
        }),
      });

      const data = await response.json();

      if (!response.ok) {
		toast.error(response.message, {
			position: "top-center",
		  })
        throw new Error(data.message || "Signup failed.");
      }

      // If signup is successful
    //   setLogin(true);
      setErrorMessage("");
      localStorage.setItem("token", data.token); // Save token if required
      navigate("/"); // Redirect to home

    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  useEffect(() => {
    if (login) {
      isLogin(true);
    }
  }, [login, isLogin]);

  return (
    <div className="login">
      <div className="login_sidebar">
        <figure className="login_image">
          <img
            src="https://images.unsplash.com/photo-1460467820054-c87ab43e9b59?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1967&q=80"
            alt=""
          />
        </figure>
      </div>
      <div className="login_form">
        <div className="login_content">
          <div className="logo">
            <img src={Logo} alt="logo" />
          </div>
          <h2 className="page_heading">Sign Up</h2>
        </div>
        <form className="form" onSubmit={handleSignup}>
          <div className="form_control">
            <Input
              type="text"
              value={formData.username}
              onChange={(value) => handleInputChange("username", value)}
              placeholder="Username"
              icon={<Icons.TbUser />}
              label="Username"
            />
          </div>
          <div className="form_control">
            <Input
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange("email", value)}
              placeholder="Email or Phone Number"
              icon={<Icons.TbMail />}
              label="Email"
            />
          </div>
          <div className="form_control">
            <Input
              type={show ? "text" : "password"}
              value={formData.password}
              onChange={(value) => handleInputChange("password", value)}
              placeholder="Password"
              icon={<Icons.TbEye />}
              onClick={handleShowPassword}
              label="Password"
            />
          </div>
          <div className="form_control">
            <Input
              type={show ? "text" : "password"}
              value={formData.Cpassword}
              onChange={(value) => handleInputChange("Cpassword", value)}
              placeholder="Confirm Password"
              icon={<Icons.TbEye />}
              onClick={handleShowPassword}
              label="Confirm Password"
            />
          </div>
          <div className="form_control">
            <CheckBox
              id="exampleCheckbox"
              label="Remember me"
              checked={isRemember}
              onChange={handleRememberChange}
            />
          </div>
          {errorMessage && <small className="error-message">{errorMessage}</small>}
          <div className="form_control">
            <Button label={loading ? "Signing Up..." : "Sign Up"} type="submit" disabled={loading} />
          </div>
        </form>
        <p className="signup_link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
