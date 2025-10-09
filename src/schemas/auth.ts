import { z } from 'zod'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const loginSchema = z.object({
    email: z.string().trim().email("Email not valid"),
    password: z.string()
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const signupSchema = z.object({
    email: z.string().trim().email("Email not valid"),
    password: z.string().min(6, "password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "password must be at least 6 characters"),
    role:z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
})



export type SignupSchema = z.infer<typeof signupSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
