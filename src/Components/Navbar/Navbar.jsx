import React from "react";
import "./Navbar.css";
import menu_icon from "../../assets/menu.png";
import logo from "../../assets/logo.png";
import search_icon from "../../assets/search.png";
import upload_icon from "../../assets/upload.png";
import more_icon from "../../assets/more.png";
import notification_icon from "../../assets/notification.png";
import profile_icon from "../../assets/user_profile.jpg";
import { Link } from "react-router-dom";


export const Navbar = ({setSidebar}) => {
  return (
    <nav className="flex-div">
      <div className="nav-left flex-div">
        <img className="menu-icon" onClick={()=>setSidebar(prev=>prev===false?true:false)} src={menu_icon} alt="Menu" />
        <Link to='/'><img className="logo-icon" src={logo} alt="Logo" /></Link>
      </div>

      <div className="nav-middle flex-div">
        <div className="search-box flex-div">
          <input type="text" placeholder="Search" />
          <img src={search_icon} alt="Search" />
        </div>

      </div>

      <div className="nav-right flex-div">
        <img className="upload-icon" src={upload_icon} alt="Upload" />
        <img className="more-icon" src={more_icon} alt="More" />
        <img className="notification-icon" src={notification_icon} alt="Notification" />
        <img className="profile-icon user-icon" src={profile_icon} alt="Profile" />
      </div>
    </nav>
  );
};

export default Navbar;
