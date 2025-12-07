
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



export const ProfileSchema = z.object({
  fullname: z.string().min(2, "Name is too short"),
  email: z.string().email(),
  contact_info: z.string().min(10, "Invalid phone").max(10, "Phone number is too long"),
  formatted_address: z.string().optional(),
  place_id: z.string().optional(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
});
export type ProfileForm = z.infer<typeof ProfileSchema>;



export const addressSchema = z.object({
  address: z.string().min(1, "Address invalid")
})
export type AddressType = z.infer<typeof addressSchema>;




export const priceandDurationSchema = z.object({
  price: z.string()
    .trim()
    .min(1, { message: "Price is required" })
    .refine(v => /^\d+(\.\d{1,2})?$/.test(v), { message: "Invalid price format" }),

  duration: z.string()
    .trim()
    .min(1, { message: "Price is required"  })
    .refine(v => /^[0-9]+$/.test(v), { message: "Duration must be a whole number (in minutes)" })
    .refine(v => Number(v) > 0, { message: "Phải > 0" }),
});

export type InputPriceandDurationValues = z.infer<typeof priceandDurationSchema>;





export type SignupSchema = z.infer<typeof signupSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;

export type ResetPasswordType = z.infer<typeof resetPassword>;
