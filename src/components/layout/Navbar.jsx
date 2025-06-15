import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as Icons from "react-icons/tb";
import Input from '../common/Input.jsx';
import Profile from '../common/Profile.jsx';
import ProfileImg from '../../images/common/adminProfile.png';

const Navbar = () => {
  const [user] = useState({
    username: JSON.parse(localStorage?.info)?.name || "" ,
    email: JSON.parse(localStorage?.info)?.email || "",
  });

  return (
    <div className="navbar">
      <div className="navbar_wrapper">
        <div className="container">
          <div className="navbar_main">
            <Input
              icon={<Icons.TbSearch />}
              placeholder="Search..."
              className="navbar_search"
            />
            <div className="navbar_icons">
              <Profile
                name={user.username}
                slogan={user.email}
                className="admin_profile"
                src={ProfileImg}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;