import React, { useEffect, useState } from "react";
import "./MainPage.css";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { TransactionForm } from "../../components/TransactionForm/TransactionForm";
import { useGetTransactionsWithUserID } from "../../useTransaction";
import { useLogout } from "../../useAuth";
import TransactionCard from "../../components/TransactionCard/TransactionCard";
import DatePicker from "../../components/DatePicker/DatePicker";

export const MainPage = () => {
  const userID = localStorage.getItem("userID");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const [IsTransactionFormVisible, setIsTransactionFormVisible] =
    useState(false);
  const [isNew, setIsNew] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState({});
  const [filteredTransactions, setFilteredTransactions] = useState(null);

  const today = new Date();
  const defaultStartDate = new Date(today);
  defaultStartDate.setDate(today.getDate() - 31);

  const [dateRangeValue, setDateRangeValue] = useState({
    start: defaultStartDate.toISOString().split("T")[0],
    end: today.toISOString().split("T")[0],
  });

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
    const userID = localStorage.getItem("userID");
    const username = localStorage.getItem("username");
    setIsLoggedIn(!!username && !!userID);
  }, []);

  const handleOnLogin = () => {
    navigate("/auth");
  };

  const handleOpenPopup = () => {
    setIsNew(true);
    setIsTransactionFormVisible(true);
  };

  const handleOpenPopupEdit = () => {
    setIsNew(false);
    setIsTransactionFormVisible(true);
  };

  const handleClosePopup = () => {
    setIsTransactionFormVisible(false);
  };

  const logoutMutation = useLogout();
  const handleLogout = async () => {
    try {
      console.log("masuk logout");
      await logoutMutation.mutateAsync();
      alert("Logout Successful!");
      setIsLoggedIn(false);
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

  const sortedTransactions = transactions.sort(
    (a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)
  );

  const handleDateRangeSearch = () => {
    const { start, end } = dateRangeValue;

    const filtered = sortedTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.transaction_date);
      return (
        transactionDate >= new Date(start) && transactionDate <= new Date(end)
      );
    });

    setFilteredTransactions(filtered);
  };

  const groupedTransactions = filteredTransactions
    ? filteredTransactions.reduce((acc, transaction) => {
        const rawDate = new Date(transaction.transaction_date);
        // const formattedDate = rawDate.toISOString().split("T")[0];
        const formattedDate = [
          String(rawDate.getDate()).padStart(2, "0"), // Day (dd)
          String(rawDate.getMonth() + 1).padStart(2, "0"), // Month (MM)
          rawDate.getFullYear(), // Year (yyyy)
        ].join("-");

        if (!acc[formattedDate]) {
          acc[formattedDate] = [];
        }
        acc[formattedDate].push(transaction);
        return acc;
      }, {})
    : sortedTransactions.reduce((acc, transaction) => {
        const rawDate = new Date(transaction.transaction_date);
        const formattedDate = [
          String(rawDate.getDate()).padStart(2, "0"), // Day (dd)
          String(rawDate.getMonth() + 1).padStart(2, "0"), // Month (MM)
          rawDate.getFullYear(), // Year (yyyy)
        ].join("-");

        if (!acc[formattedDate]) {
          acc[formattedDate] = [];
        }
        acc[formattedDate].push(transaction);
        return acc;
      }, {});

  if (isError && error.response?.status === 401) {
    handleLogout();
  }

  return (
    <div className="mainpage__container">
      <Header onLogin={handleOnLogin} onLogout={handleLogout} />

      {!isLoggedIn ? (
        <></>
      ) : (
        <>
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

          <div className="mainpage__date-range">
            {/* DATE Range */}
            <DatePicker
              id="date-range"
              label=""
              mode="range"
              value={dateRangeValue}
              onChange={setDateRangeValue}
            />

            <div
              className="mainpage__date-range-search-button"
              onClick={handleDateRangeSearch}
            >
              Search
            </div>
          </div>
        </>
      )}

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {!isLoggedIn ? (
        <div className="mainpage__login-prompt">
          <p>
            Please{" "}
            <a href="/auth" className="mainpage__auth-link">
              Login/Register
            </a>{" "}
            to continue
          </p>
        </div>
      ) : isLoading ? (
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
                key={transaction.transaction_id}
                transaction={transaction}
                categoryOptions={categoryOptions}
                accountOptions={accountOptions}
                onClickCard={() => {
                  setSelectedTransaction(transaction);
                  handleOpenPopupEdit();
                }}
              />
            ))}
          </div>
        ))
      )}

      {IsTransactionFormVisible && (
        <TransactionForm
          isNew={isNew}
          onClose={handleClosePopup}
          categoryOptions={categoryOptions}
          accountOptions={accountOptions}
          selectedTransaction={!isNew ? selectedTransaction : null}
        />
      )}
    </div>
  );
};
