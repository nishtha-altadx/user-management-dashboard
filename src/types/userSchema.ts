import { z } from "zod";

export const userSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters"),

  email: z.string().email("Please enter a valid email"),

  phone: z
    .string()
    .regex(/^\d+$/, "Phone must contain only digits")
    .min(10, "Phone must be at least 10 digits")
    .max(15, "Phone cannot exceed 15 digits"),
});

export type UserFormData = z.infer<typeof userSchema>;
