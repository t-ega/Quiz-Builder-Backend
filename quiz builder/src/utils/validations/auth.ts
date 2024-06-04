import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const SignUpSchema = z
  .object({
    email: z.string().email(),
    username: z.string().min(3, "A longer company name is required"),
    password: z.string().min(4),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["confirm"],
  });
