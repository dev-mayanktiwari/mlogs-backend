import { z } from "zod";
import { EUserTypeConstants } from "../constant/application";
import { MAX_LENGTH_MESSAGE, MIN_LENGTH_MESSAGE } from "../constant/responseMessage";

export const registerUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(EUserTypeConstants.MIN_NAME_LENGTH, MIN_LENGTH_MESSAGE("Name", EUserTypeConstants.MIN_NAME_LENGTH))
    .max(EUserTypeConstants.MAX_NAME_LENGTH, MAX_LENGTH_MESSAGE("Name", EUserTypeConstants.MAX_NAME_LENGTH))
    .regex(/^[A-Za-z\s]+$/, "Name can only contain alphabets and spaces"),
  email: z.string().trim().email(),
  username: z
    .string()
    .trim()
    .min(EUserTypeConstants.MIN_USERNAME_LENGTH, MIN_LENGTH_MESSAGE("Username", EUserTypeConstants.MIN_USERNAME_LENGTH))
    .max(EUserTypeConstants.MAX_USERNAME_LENGTH, MAX_LENGTH_MESSAGE("Username", EUserTypeConstants.MAX_USERNAME_LENGTH))
    .regex(/^[A-Za-z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z
    .string()
    .trim()
    .min(EUserTypeConstants.MIN_PASSWORD_LENGTH, MIN_LENGTH_MESSAGE("Password", EUserTypeConstants.MIN_PASSWORD_LENGTH))
    .max(EUserTypeConstants.MAX_PASSWORD_LENGTH, MAX_LENGTH_MESSAGE("Password", EUserTypeConstants.MAX_PASSWORD_LENGTH))
    .regex(/(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
    .regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, "Password must contain at least one special character")
});

export const loginUserSchema = z.object({
  email: z.string().trim(),
  password: z
    .string()
    .trim()
    .min(EUserTypeConstants.MIN_PASSWORD_LENGTH, MIN_LENGTH_MESSAGE("Password", EUserTypeConstants.MIN_PASSWORD_LENGTH))
    .max(EUserTypeConstants.MAX_PASSWORD_LENGTH, MAX_LENGTH_MESSAGE("Password", EUserTypeConstants.MAX_PASSWORD_LENGTH))
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email()
});

export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .trim()
    .min(EUserTypeConstants.MIN_PASSWORD_LENGTH, MIN_LENGTH_MESSAGE("Password", EUserTypeConstants.MIN_PASSWORD_LENGTH))
    .max(EUserTypeConstants.MAX_PASSWORD_LENGTH, MAX_LENGTH_MESSAGE("Password", EUserTypeConstants.MAX_PASSWORD_LENGTH))
    .regex(/(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
    .regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, "Password must contain at least one special character")
});

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .trim()
      .min(EUserTypeConstants.MIN_PASSWORD_LENGTH, MIN_LENGTH_MESSAGE("Password", EUserTypeConstants.MIN_PASSWORD_LENGTH))
      .max(EUserTypeConstants.MAX_PASSWORD_LENGTH, MAX_LENGTH_MESSAGE("Password", EUserTypeConstants.MAX_PASSWORD_LENGTH)),

    newPassword: z
      .string()
      .trim()
      .min(EUserTypeConstants.MIN_PASSWORD_LENGTH, MIN_LENGTH_MESSAGE("Password", EUserTypeConstants.MIN_PASSWORD_LENGTH))
      .max(EUserTypeConstants.MAX_PASSWORD_LENGTH, MAX_LENGTH_MESSAGE("Password", EUserTypeConstants.MAX_PASSWORD_LENGTH))
      .regex(/(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
      .regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, "Password must contain at least one special character"),
    confirmNewPassword: z.string().trim()
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match"
  });

export const guestBookSchema = z.object({
  message: z
    .string()
    .min(EUserTypeConstants.MIN_MESSAGE_LENGTH, MIN_LENGTH_MESSAGE("Message", EUserTypeConstants.MIN_MESSAGE_LENGTH))
    .max(EUserTypeConstants.MAX_MESSAGE_LENGTH, MAX_LENGTH_MESSAGE("Message", EUserTypeConstants.MAX_MESSAGE_LENGTH).trim())
});

export type RegisterUserType = z.infer<typeof registerUserSchema>;
export type LoginUserType = z.infer<typeof loginUserSchema>;
export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordType = z.infer<typeof changePasswordSchema>;
export type GuestBookType = z.infer<typeof guestBookSchema>;
