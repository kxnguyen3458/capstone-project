import z from "zod";


export const bookingTime = z.object({
     preferredDate: z.date({ error: "This field is required"}),
    preferredTime: z
        .string({error: "Time is required"})
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)")
})
export type BookingTime = z.infer<typeof bookingTime>




export const customerBookingInfoSchema = z.object({
    fullname: z.string().min(2, "Name is too short"),
    email: z.string().email(),
    contact_info: z.string().min(10, "Invalid phone").max(10, "Phone number is too long"),
    address: z.string(),
    
})
export type CustomerBookingInfo = z.infer<typeof customerBookingInfoSchema>





