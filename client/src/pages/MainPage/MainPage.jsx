import React, { useEffect, useState } from "react";
import "./MainPage.css";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { TransactionForm } from "../../components/TransactionForm/TransactionForm";
import { useGetTransactionsWithUserID } from "../../useTransaction";
import { useLogout } from "../../useAuth";
import TransactionCard from "../../components/TransactionCard/TransactionCard";

export const MainPage = () => {
  const userID = localStorage.getItem("userID");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const [IsTransactionFormVisible, setIsTransactionFormVisible] =
    useState(false);
  const [isNew, setIsNew] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const categoryOptions = [
    { value: "food", label: "Food" },
    { value: "social_life", label: "Social Life" },
    { value: "transport", label: "Transport" },
    { value: "shopping", label: "Shopping" },
  ];
  const accountOptions = [
    { value: "cash", label: "Cash" },
    { value: "bank_accounts", label: "Bank Accounts" },
    { value: "card", label: "Card" },
  ];

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

  const logoutMutation = useLogout();
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate("/");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to log out. Please try again."
      );
    }
  };

  const {
    data: apiData,
    isLoading,
    isError,
    error,
  } = useGetTransactionsWithUserID(userID);
  const transactions = apiData?.data || [];

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const rawDate = new Date(transaction.transaction_date); // Parse ISO date
    const formattedDate = rawDate.toISOString().split("T")[0]; // Get YYYY-MM-DD
    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(transaction);
    return acc;
  }, {});

  if (isError && error.response?.status === 401) {
    handleLogout();
  }

  console.log(apiData);

  return (
    <div className="mainpage__container">
      <Header onLogin={handleOnLogin} onLogout={handleLogout} />

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

      {isLoading ? (
        <p>Loading transactions...</p>
      ) : isError ? (
        <p>Error loading transactions: {error.message}</p>
      ) : Object.keys(groupedTransactions).length === 0 ? (
        <p>No transactions available</p>
      ) : (
        Object.entries(groupedTransactions).map(([date, transactions]) => (
          <div key={date} className="transaction-group">
            <h3 className="transaction-group__date">{date}</h3>
            {transactions.map((transaction) => (
              <TransactionCard
                transaction={transaction}
                categoryOptions={categoryOptions}
                accountOptions={accountOptions}
                onClickCard={handleOpenPopup}
              />
            ))}
          </div>
        ))
      )}

      {IsTransactionFormVisible && (
        <TransactionForm
          onClose={handleClosePopup}
          categoryOptions={categoryOptions}
          accountOptions={accountOptions}
        />
      )}
    </div>
  );
};
