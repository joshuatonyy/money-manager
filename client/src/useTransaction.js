import { createTransactionApi } from "./api";
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
