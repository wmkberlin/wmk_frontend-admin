import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'react-icons/tb';
import { useDispatch } from 'react-redux';
import Logo from "../../images/logo.webp";
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import CheckBox from '../../components/common/CheckBox.jsx';
import { Routes, Route,  useNavigate } from "react-router-dom";
import HomaPgeLogo from "../../images/common/HomePagelogo.webp"
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email_address: "",
    password: "",
  });
  const [isRemember, setIsRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const handleInputChange = (fieldName, newValue) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: newValue,
    }));
  };

  const handleRememberChange = (check) => {
    setIsRemember(check);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(false);

    try {
        const response = await fetch('https://wmk-backend.onrender.com/api/auth/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            setLoginError(true);
            return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('info', JSON.stringify(data.user))
        setTimeout(() => {
        window.location.href = "/";
        
        }, 500);
        dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
    } catch (error) {
        setLoginError(true);
    }
};


  return (
    <div className="login">
      <div className="login_sidebar">
        <figure className="login_image">
          <img src={HomaPgeLogo} alt="" />
        </figure>
      </div>
      <div className="login_form">
        <div className="login_content">
          <div to="/" className="logo">
            <img src={Logo} alt="logo" />
          </div>
          <h2 className="page_heading">Login</h2>
        </div>
        <form className="form" onSubmit={handleLogin}>
          <div className="form_control">
            <Input
              type="text"
              value={formData.email_address}
              onChange={(value) =>
                handleInputChange("email_address", value)
              }
              placeholder="Email or Phone Number"
              icon={<Icons.TbMail/>}
              label="Email or Number"
            />
          </div>
          <div className="form_control">
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(value) =>
                handleInputChange("password", value)
              }
              placeholder="Password"
              label="Password"
              onClick={handleShowPassword}
              icon={<Icons.TbEye/>}
            />
          </div>
          <div className="form_control">
            <CheckBox
              id="rememberCheckbox"
              label="Remember me"
              checked={isRemember}
              onChange={handleRememberChange}
            />
          </div>
          {loginError && <small className="incorrect">Incorrect email or password and Remember me</small>}
          <div className="form_control">
          <Button
            label="Login"
            type="submit"
            onClick={handleLogin}
          />

          </div>
        </form>
        {/* <p className="signup_link">
          Don't have an account yet? <Link to="/signup">Join Metronic</Link>
        </p> */}
        {/* <button className="google_signin">
          <figure>
            <img src="https://img.icons8.com/color/1000/google-logo.png" alt="" />
          </figure>
          <h2>Sign in with Google</h2>
        </button> */}
      </div>
    </div>
  );
}

export default Login;