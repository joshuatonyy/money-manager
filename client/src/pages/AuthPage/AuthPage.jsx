import React, { useState } from "react";
import { Outlet, Link, Navigate, useNavigate } from "react-router-dom";
import { loginApi, registerApi } from "../../api";
import "./AuthPage.css";
import AppleTextfield from "../../components/AppleTextfield/AppleTextfield";
import { useLogin, useRegister } from "../../useAuth";

export const AuthPage = () => {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const [usernameValue, setUsernameValue] = useState("");

  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const navigate = useNavigate();

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const handleLogin = async () => {
    try {
      setSuccess(false);
      setErrorMessage("");
      if (!emailValue || !passwordValue) {
        setErrorMessage("All fields are required.");
        return;
      }
      await loginMutation.mutateAsync({
        email: emailValue,
        password: passwordValue,
      });
      setErrorMessage("");
      navigate("/");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to log in. Please try again."
      );
    }
  };

  const handleRegister = async () => {
    try {
      setErrorMessage("");
      setSuccess(false);

      if (!usernameValue || !emailValue || !passwordValue) {
        setErrorMessage("All fields are required.");
        return;
      }

      await registerMutation.mutateAsync({
        email: emailValue,
        username: usernameValue,
        password: passwordValue,
      });
      setErrorMessage("");
      setSuccess(true);
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <div className="authpage__parent-container">
      <div className="container">
        <div className="header">
          <div className="text">{isRegisterMode ? "Register" : "Login"}</div>
        </div>

        <div className="entries">
          {/* USERNAME */}
          {isRegisterMode && (
            <AppleTextfield
              id="username"
              label="Username"
              type="text"
              value={usernameValue}
              onChange={(e) => setUsernameValue(e.target.value)}
              required
            />
          )}

          {/* EMAIL */}
          <AppleTextfield
            id="email"
            label="Email"
            type="email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            required
          />

          {/* PASSWORD */}
          <AppleTextfield
            id="password"
            label="Password"
            type="password"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            required
          />
        </div>

        {/* Error Message */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {/* Success Message */}
        {success && (
          <div className="success-message">
            Registration successful! You can now{" "}
            <Link
              to="#"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrorMessage("");
                setEmailValue("");
                setPasswordValue("");
                setUsernameValue("");
                setSuccess(false);
              }}
            >
              Sign in
            </Link>
            .
          </div>
        )}

        {/*Login Button*/}
        <div className="submit-container">
          <div
            className="submit-login"
            onClick={isRegisterMode ? handleRegister : handleLogin}
          >
            {isRegisterMode ? "Register" : "Login"}
          </div>
        </div>

        {/*Register New Account Hyperlink*/}
        <div className="register-new-account">
          {isRegisterMode
            ? "Already have an account"
            : "Don't have an account?"}{" "}
          <span
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setErrorMessage("");
              setEmailValue("");
              setPasswordValue("");
              setUsernameValue("");
              setSuccess(false);
            }}
          >
            <Link to="#">
              {isRegisterMode ? "Login." : "Create a new account."}
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
