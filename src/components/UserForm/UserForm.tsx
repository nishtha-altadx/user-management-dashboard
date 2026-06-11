import { Button } from "../ui/Button/Button";
import { Input } from "../ui/Input/Input";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, type UserFormData } from "../../types/userSchema";
import type { UserFormValues } from "../../types/user";

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;

  isSubmitting?: boolean;

  initialValues?: UserFormValues;
}

export const UserForm = ({
  onSubmit,
  isSubmitting = false,
  initialValues,
}: UserFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),

    defaultValues: {
      name: initialValues?.name ?? "",
      email: initialValues?.email ?? "",
      phone: initialValues?.phone ?? "",
    },
  });

  const submitHandler = (data: UserFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div>
          <label>Name</label>

          <Input
            placeholder="Enter name"
            error={errors.name?.message}
            {...register("name")}
          />
        </div>

        <div>
          <label>Email</label>

          <Input
            placeholder="Enter email"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <div>
          <label>Phone</label>

          <Input
            placeholder="Enter phone"
            error={errors.phone?.message}
            {...register("phone")}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "10px",
          }}
        >
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save User"}
          </Button>
        </div>
      </div>
    </form>
  );
};
