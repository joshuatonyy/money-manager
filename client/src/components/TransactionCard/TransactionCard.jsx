import React from "react";
import "./TransactionCard.css";

const TransactionCard = ({ transaction, onClickCard = () => {}, categoryOptions, accountOptions }) => {
  const translateValue = (value, options) => {
    const match = options.find((option) => option.value === value);
    return match ? match.label : value;
  };

  return (
    <div className="transaction-card" onClick={onClickCard}>
      <div className="transaction-card__header">
        <p className="transaction-card__category">
          {translateValue(transaction.transaction_category, categoryOptions)}
        </p>
        <p className="transaction-card__amount">
          Rp. {transaction.transaction_amount}
        </p>
      </div>
      <div className="transaction-card__details">
        <p className="transaction-card__account">
          Account: {translateValue(transaction.transaction_account, accountOptions)}
        </p>
        <p className="transaction-card__notes">
          Notes: {transaction.transaction_notes}
        </p>
      </div>
    </div>
  );
};

export default TransactionCard;
