import { z } from 'zod';

export const UserValidator = z.object({
	id: z.number(),
	username: z.string(),
	email: z.string().email(),
	referralCode: z.string(),
	credits: z.number(),
});

export type User = z.infer<typeof UserValidator>;

export const LoginCredentialsValidator = z.object({
	email: z.string().email(),
	password: z.string(),
});

export type LoginCredentials = z.infer<typeof LoginCredentialsValidator>;

export const RegisterDataValidator = z.object({
	username: z.string(),
	email: z.string().email(),
	password: z.string(),
	referralCode: z.string().optional(),
});

export type RegisterData = z.infer<typeof RegisterDataValidator>;

export const AuthStateValidator = z.object({
	token: z.string().nullable(),
	user: UserValidator.nullable(),
});

export type AuthState = z.infer<typeof AuthStateValidator>;
