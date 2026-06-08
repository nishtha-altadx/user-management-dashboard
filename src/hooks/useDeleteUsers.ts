import { useMutation } from "@tanstack/react-query";

import { deleteUser } from "../services/userService";

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: deleteUser,
  });
};
