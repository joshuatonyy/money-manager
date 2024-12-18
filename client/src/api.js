import axios from "axios";

const API_URL = process.env.API_URL || "http://localhost:8080";

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Login
export const loginApi = async (email, password) => {
  const response = await apiClient.post("/login", { email, password });
  return response.data;
};

// Logout
export const logoutApi = async () => {
  const response = await apiClient.get("/logout");
  return response.data;
};

// Register
export const registerApi = async (userData) => {
  const response = await apiClient.post("/signup", userData);
  return response.data;
};

// Create Transaction
export const createTransactionApi = async (transactionData) => {
  try {
    const response = await apiClient.post("/transactions/", transactionData);
    return response.data;
  } catch (error) {
    console.error("Create transaction error:", error.response?.data || error.message);
    throw error;
  }
}

// Upload Image
export const uploadImageApi = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`${API_URL}/transactions/upload-image`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.filePath;
  } catch (error) {
    console.error("Image upload error:", error.response?.data || error.message);
    throw error;
  }
};

// Get Transactions From User ID
export const GetTransactionsByUserIDApi = async (userID) => {
  const response = await apiClient.get("/transactions/", userID);
  return response.data;
}