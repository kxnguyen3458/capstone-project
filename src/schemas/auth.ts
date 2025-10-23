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
    role: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const resetPassword = z.object({
    password: z.string().min(6, "password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
})





const namePart = z
  .string()
  .trim()
  .min(1, "Required")
  .max(64, "Too long")
  .regex(/^[\p{L}\p{M}][\p{L}\p{M}'\- ]*$/u, "Invalid characters");


export const customerInputProfile = z.object({
    firstName:namePart,
    lastName: namePart,
    email: z.string().trim().email("Email not valid"),
    contact_info: z
    .string()
    .regex(/^\+?[0-9]{10}$/, "Invalid phone number"),
    address: z
    .string()
    .regex(
        /^[0-9]{1,6}\s+[A-Za-z0-9\s.#-]+(?:\s+(APT|UNIT|STE|SUITE|FL|BLDG|RM|#)\s*\w+)?$/,
        "Invalid address format"
    ),
}).transform((data) => {
    const normalize = (s: string) => s.replace(/\s+/g, " ").trim();
    const first = normalize(data.firstName);
    const last = normalize(data.lastName);
    return {
      ...data,
      fullName: `${first} ${last}`,
    };
  });


export type CustomerInputProfile = z.input<typeof customerInputProfile>
// export type CustomerOutputProfile = z.output<typeof customerInputProfile>

export type SignupSchema = z.infer<typeof signupSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;

export type ResetPasswordType = z.infer<typeof resetPassword>;
