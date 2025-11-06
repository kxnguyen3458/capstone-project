
import { US_STATES } from '@/constants/utilConstant'
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





const STATES = US_STATES.map(s => s.value);
export const AddressInputSchema = z.object({
  houseNumber: z.string().min(1, "Required"),
  street: z.string().min(2, "Required"),
  city: z.string().min(2, "Required"),
  state: z.string().refine(val => STATES.includes(val), {
    message: "Please select a state",
  }),
  zipcode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP"),
});
export type AddressInput = z.infer<typeof AddressInputSchema>;

export const ProfileSchema = z.object({
  fullname: z.string().min(2, "Name is too short"),
  email: z.string().email(),          
  contact_info: z.string().min(10, "Invalid phone").max(10,"Phone number is too long"),
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


//********************************************FIX*************************** */





//********************************************FIX*************************** */



export type SignupSchema = z.infer<typeof signupSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;

export type ResetPasswordType = z.infer<typeof resetPassword>;
