import React, { useEffect, useState } from "react";
import "./TransactionForm.css";
import AppleTextfield from "../AppleTextfield/AppleTextfield";
import DatePicker from "../DatePicker/DatePicker";
import { Dropdown } from "../Dropdown/Dropdown";
import { ImageUpload } from "../ImageUpload/ImageUpload";
import { useCreateTransaction, useEditTransaction } from "../../useTransaction";
import { uploadImageApi } from "../../api";

export const TransactionForm = ({
  isNew,
  onClose,
  onSubmit,
  selectedTransaction,
  categoryOptions,
  accountOptions,
}) => {
  const [amountValue, setAmountValue] = useState("");
  const [notesValue, setNotesValue] = useState("");
  const [verifiedValue, setVerifiedValue] = useState(false);
  const [dateValue, setDateValue] = useState();
  const [categoryValue, setCategoryValue] = useState("");
  const [accountValue, setAccountValue] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [idValue, setIdValue] = useState(-1);

  useEffect(() => {
    if (selectedTransaction && !isNew) {
      const date = new Date(selectedTransaction.transaction_date);
      const formattedDate = date.toISOString().split("T")[0];

      setAmountValue(selectedTransaction.transaction_amount || "");
      setNotesValue(selectedTransaction.transaction_notes || "");
      setVerifiedValue(selectedTransaction.transaction_verified || false);
      setDateValue(formattedDate || "");
      setCategoryValue(selectedTransaction.transaction_category || "");
      setAccountValue(selectedTransaction.transaction_account || "");
      setImageFileUrl(selectedTransaction.transaction_image_url || "");
      setIdValue(selectedTransaction.transaction_id || -1);

      console.log(imageFileUrl);
    } else {
      setAmountValue("");
      setNotesValue("");
      setVerifiedValue(false);
      setDateValue("");
      setCategoryValue("");
      setAccountValue("");
      setImageFileUrl("");
      setIdValue(-1);
    }

    console.log(notesValue);
  }, [selectedTransaction, isNew]);

  const { mutate: createTransaction, isLoadingCreate } = useCreateTransaction();

  const { mutate: editTransaction, isLoadingUpdate } = useEditTransaction();

  const handleSubmit = async () => {
    if (
      !amountValue ||
      !notesValue ||
      !notesValue ||
      !dateValue ||
      !categoryValue ||
      !categoryValue ||
      !(imageFile || imageFileUrl)
    ) {
      setErrorMessage("Please fill all the form");
      return;
    }

    if (isNew) {
      try {
        const imagePath = await uploadImageApi(imageFile);
        const userID = localStorage.getItem("userID");
        createTransaction(
          {
            user_id: userID,
            transaction_category: categoryValue,
            transaction_account: accountValue,
            transaction_date: dateValue,
            transaction_amount: amountValue,
            transaction_notes: notesValue,
            transaction_image_url: imagePath,
            transaction_verified: verifiedValue,
          },
          {
            onSuccess: () => {
              setErrorMessage("");
              alert("Transaction created successfully!");
              onClose();
            },
            onError: (error) => {
              alert("Error creating transaction: " + error.message);
            },
          }
        );
      } catch (error) {
        setErrorMessage("Error on uploading transaction, try again later");
        console.error("Error: ", error);
      }
    } else {
      try {
        var imagePath;
        if (imageFile) {
          imagePath = await uploadImageApi(imageFile);
        } else {
          imagePath = imageFileUrl;
        }
        editTransaction(
          {
            transactionData: {
              transaction_category: categoryValue,
              transaction_account: accountValue,
              transaction_date: dateValue,
              transaction_amount: amountValue,
              transaction_notes: notesValue,
              transaction_image_url: imagePath,
              transaction_verified: verifiedValue,
            },
            transactionID: idValue,
          },
          {
            onSuccess: () => {
              setErrorMessage("");
              alert("Transaction edited successfully!");
              onClose();
            },
            onError: (error) => {
              alert("Error editing transaction: " + error.message);
            },
          }
        );
      } catch (error) {
        setErrorMessage("Error on uploading transaction, try again later");
        console.error("Error: ", error);
      }
    }
  };

  const handleCategoryDropdownChange = (e) => {
    setCategoryValue(e.target.value);
  };

  const handleAccountDropdownChange = (e) => {
    setAccountValue(e.target.value);
  };

  const handleVerifiedChange = (verified) => {
    setVerifiedValue(verified);
  };

  return (
    <div className="transactionform__overlay">
      <div className="transactionform__container">
        <div className="transactionform__header">
          <p className="transactionform__header-title">
            {isNew ? "New Transaction" : "Edit Transaction"}
          </p>
          <button
            className="transactionform__header-close-button"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="transactionform__entries">
          {/* Error Message */}
          {errorMessage && (
            <p className="transactionform__error">{errorMessage}</p>
          )}

          {/* DATE */}
          <DatePicker
            id="transaction-date"
            label="Transaction Date"
            mode="picker"
            value={dateValue}
            onChange={setDateValue}
          />

          {/* Category */}
          <Dropdown
            label="Category"
            id="transaction-category"
            options={categoryOptions}
            defaultValue={categoryValue}
            onChange={handleCategoryDropdownChange}
          />

          {/* Account */}
          <Dropdown
            label="Account"
            id="transaction-account"
            options={accountOptions}
            defaultValue={accountValue}
            onChange={handleAccountDropdownChange}
          />

          {/* Amount */}
          <AppleTextfield
            id="transaction-amount"
            label="Amount"
            type="currency"
            value={amountValue}
            onChange={(e) => setAmountValue(e.target.value)}
            initialValue={amountValue}
            required
          />

          {/* Notes */}
          <AppleTextfield
            id="transaction-notes"
            label="Notes"
            type="text"
            value={notesValue}
            onChange={(e) => {
              setNotesValue(e.target.value);
            }}
            initialValue={notesValue}
            required
          />

          {/* Upload Image */}
          <ImageUpload
            label="Upload"
            onFileChange={setImageFile}
            defaultPreview={!isNew ? imageFileUrl : null}
          />

          {/* Verified */}
          <div className="transactionform__verified">
            <p>Verified</p>
            <input
              type="radio"
              id="verified-no"
              value={false}
              checked={verifiedValue === false}
              onChange={() => handleVerifiedChange(false)}
            />
            <label htmlFor="verified-no">No</label>
            <input
              type="radio"
              id="verified-yes"
              value={false}
              checked={verifiedValue === true}
              onChange={() => handleVerifiedChange(true)}
            />
            <label htmlFor="verified-yes">Yes</label>
          </div>
        </div>

        <div className="transactionform__submit-container">
          <div
            className="transactionform__submit-button"
            onClick={handleSubmit}
          >
            Submit
          </div>
        </div>
      </div>
    </div>
  );
};
