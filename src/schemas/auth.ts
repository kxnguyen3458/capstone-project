
import {  US_STATES } from '@/constants/utilConstant'
import { z } from 'zod'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const loginSchema = z.object({
    email: z.string().trim().email("Email not valid"),
    password: z.string()
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const signupSchema = z.object({
    email: z.string().trim().email("Email not valid"),
    password: z.string().min(8, "password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "password must be at least 8 characters"),
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




const STATES = US_STATES.map(s=>s.value);
export const addresSchema = z.object({
    houseNumber: z.string().min(1,"House number is required"),
    street:z.string().min(1,"Street is required"),
    city: z.string().min(1,"City is required"),
    zipcode: z.string().min(1,"Zipcode is required"),
    state: z.string().refine(val => STATES.includes(val), {
    message: "Please select a state",
  }),

})

const namePart = z
  .string()
  .trim()
  .min(1, "Required")
  .max(64, "Too long")
  .regex(/^[\p{L}\p{M}][\p{L}\p{M}'\- ]*$/u, "Invalid characters");


export const inputProfile = z.object({
    firstName:namePart,
    lastName: namePart,
    email: z.string().trim().email("Email not valid"),
    contact_info: z
    .string()
    .regex(/^\+?[0-9]{10}$/, "Invalid phone number"),
    address: addresSchema
}).transform((data) => {
    const normalize = (s: string) => s.replace(/\s+/g, " ").trim();
    const first = normalize(data.firstName);
    const last = normalize(data.lastName);
    return {
      ...data,
      fullName: `${first} ${last}`,
    };
  });


export type AdressSchema = z.input<typeof addresSchema>
export type InputProfile = z.input<typeof inputProfile>
// export type CustomerOutputProfile = z.output<typeof customerInputProfile>

export type SignupSchema = z.infer<typeof signupSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;

export type ResetPasswordType = z.infer<typeof resetPassword>;
