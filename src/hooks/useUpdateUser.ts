import { useMutation } from "@tanstack/react-query";
import { updateUser } from "../services/userService";

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: updateUser,
  });
};
