import { z } from 'zod'
import type { User } from '@/payload-types'

export const userSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
}) satisfies z.ZodType<Partial<User>>

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})
export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
}).loose()
export type RegisterInput = z.infer<typeof registerSchema>

export const forgotPasswordSchema = z.object({
  email: z.email(),
})
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(1),
})
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

export const unlockSchema = z.object({
  email: z.email(),
})
export type UnlockInput = z.infer<typeof unlockSchema>

export const verifyEmailSchema = z.object({
  token: z.string(),
})
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>

export type LoginSchema = LoginInput
export type RegisterSchema = RegisterInput
export type ForgotSchema = ForgotPasswordInput
export type ResetSchema = ResetPasswordInput

export const forgotSchema = forgotPasswordSchema
export const resetSchema = resetPasswordSchema
