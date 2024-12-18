import React, { useState, useEffect } from "react";
import { Outlet, Link, Navigate, useNavigate } from "react-router-dom";
import "./Header.css";

export const Header = ({
  onLogin = () => {},
  onLogout = () => {},
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("userID");
    setIsLoggedIn(!!username && !!userId);
  }, []);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      onLogout();
      localStorage.removeItem("username");
      localStorage.removeItem("userID");
      setIsLoggedIn(false);
    } else {
      onLogin();
    }
  };

  return (
    <div className="header__header">
      <div className="header__header-left">
        <p className="header__header-title">Tenio Money Manager</p>
      </div>
      <div className="header__header-right">
        <p className="header__header-login-logout" onClick={handleLoginLogout}>
          {isLoggedIn ? "Logout" : "Login"}
        </p>
      </div>
    </div>
  );
};

export default Header;
