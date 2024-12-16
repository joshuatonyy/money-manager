import { loginApi, registerApi, logoutApi } from "./api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation({
    mutationFn: async ({ email, password }) => loginApi(email, password),

    onSuccess: (data) => {
      const { id, username } = data;

      localStorage.setItem("userID", id);
      localStorage.setItem("username", username);
    },
    onError: (error) => {
      console.error("Login error:", error.response?.data || error.message);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      // Clear user data
      localStorage.removeItem("userID");
      localStorage.removeItem("username");
    },
    onError: (error) => {
      console.error("Logout error:", error.response?.data || error.message);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData) => registerApi(userData),
    onSuccess: (data) => {
      console.log("Registration successful:", data);
    },
    onError: (error) => {
      console.error("Register error:", error.response?.data || error.message);
    },
  });
};
