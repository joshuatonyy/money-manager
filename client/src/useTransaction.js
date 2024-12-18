import { createTransactionApi, editTransactionApi, GetTransactionsByUserIDApi } from "./api";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionData) =>
      createTransactionApi(transactionData),
    onSuccess: () => {
      queryClient.invalidateQueries(["getTransactionsByUserID"]);
    },
  });
};

export const useGetTransactionsWithUserID = (userID) => {
  return useQuery({
    queryKey: ["getTransactionsByUserID", userID],
    queryFn: () => GetTransactionsByUserIDApi(userID),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: !!userID
  });
};

export const useEditTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({transactionData, transactionID}) => editTransactionApi(transactionData, transactionID),
    onSuccess: () => {
      queryClient.invalidateQueries(["getTransactionsByUserID"]);
    },
  })
}