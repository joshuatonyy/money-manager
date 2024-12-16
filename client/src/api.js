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