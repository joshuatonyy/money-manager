import React, { useEffect, useState } from "react";
import "./MainPage.css";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { TransactionForm } from "../../components/TransactionForm/TransactionForm";
import { useGetTransactionsWithUserID } from "../../useTransaction";

export const MainPage = () => {
  const userID = localStorage.getItem("userID");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const [IsTransactionFormVisible, setIsTransactionFormVisible] =
    useState(false);
  const [isNew, setIsNew] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!username && !!userID);
    // setLoggedInUsername(username);
  }, []);

  const handleOnLogin = () => {
    navigate("/auth");
  };

  const handleOpenPopup = () => {
    setIsNew(true);
    setIsTransactionFormVisible(true);
  };

  const handleClosePopup = () => {
    setIsTransactionFormVisible(false);
  };

    const {
      data: transactions,
      isLoading,
      isError,
      error,
    } = useGetTransactionsWithUserID(userID);

    console.log(transactions);
  

  return (
    <div className="mainpage__container">
      <Header onLogin={handleOnLogin} />

      <div className="mainpage__welcome">
        <p className="mainpage__welcome-title">
          {username ? `Welcome, ${username}` : "Welcome"}
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

      {!transactions || transactions.length === 0 ? (
        <p>No transactions available</p>
      ) : (
        transactions.map((transaction) => (
          <p>{transaction.transaction_notes}</p>
        ))
      )}

      {IsTransactionFormVisible && (
        <TransactionForm onClose={handleClosePopup} />
      )}
    </div>
  );
};
