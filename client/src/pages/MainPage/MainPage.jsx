import React, { useEffect, useState } from "react";
import './MainPage.css'
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { TransactionForm } from "../../components/TransactionForm/TransactionForm";

export const MainPage = () => {
  const userID = localStorage.getItem("userID");
  const name = localStorage.getItem("userName");
  const navigate = useNavigate();

  const [IsTransactionFormVisible, setIsTransactionFormVisible] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const handleOnLogin = () => {
    navigate('/auth');
  }

  const handleOpenPopup = () => {
    setIsNew(true);
    setIsTransactionFormVisible(true);
  };

  const handleClosePopup = () => {
    setIsTransactionFormVisible(false);
  };

  return (
    <div className="mainpage__container">
      <Header onLogin={handleOnLogin}/>

      <div className="mainpage__welcome">
        <p className="mainpage__welcome-title">
          {name ? `Welcome, ${name}` : "Welcome"}
        </p>
        <div
          className="mainpage__welcome-add-button"
          onClick={() => {
            handleOpenPopup();
          }}
        >
          + Add Transaction
        </div>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      
      {IsTransactionFormVisible && (
        <TransactionForm
        onClose={handleClosePopup}
        />
      )}
    </div>
  );
};
