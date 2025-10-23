// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { useForm } from 'react-hook-form'

// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from "@/components/ui/form"
// import { customerInputProfile, signupSchema, type CustomerInputProfile, type SignupSchema } from '@/schemas/auth'
// import { zodResolver } from '@hookform/resolvers/zod'
// import RadioUserType from '../RadioUserType'
// import register from '@/services/register'
// import { toast } from 'sonner'
// import { useLocation, useNavigate } from 'react-router-dom'


// function RequestProfile() {
//     const navigate = useNavigate();
//     const location = useLocation();


//     const from = location.state?.from?.pathname || "/";


//     const form = useForm<CustomerInputProfile>({
//         resolver: zodResolver(customerInputProfile),
//         mode: "onBlur",
//         reValidateMode: "onChange",
//         defaultValues: {
//             firstName: "",
//             lastName: "",
//             email: "",
//             contact_info: "",
//             address: ""
//         }
//     })

//     const handleSubmit = async (data: CustomerInputProfile) => {

//         const ouputData = customerInputProfile.parse(data);

//     }
//     return (

//         <main className='w-screen flex justify-center items-center h-screen'>
//             <div className="mx-auto p-10
//             border border-white/20 rounded-xl shadow-lg backdrop-blur-md
//             w-[500px] min-h-[500px] max-w-lg flex-col gap-6 bg-slate-200">
//                 <Form {...form}>
//                     <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
//                         <FormField
//                             control={form.control}
//                             name="firstName"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>First Name</FormLabel>
//                                     <FormControl>
//                                         <Input placeholder="" {...field}
//                                             onFocus={() => {
//                                                 form.clearErrors("firstName");
//                                             }}
//                                             onChange={(e) => {
//                                                 field.onChange(e);
//                                             }}
//                                             onBlur={() => {
//                                                 field.onBlur();
//                                             }}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <FormField
//                             control={form.control}
//                             name="lastName"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Last Name</FormLabel>
//                                     <FormControl>
//                                         <Input placeholder="" {...field}
//                                             onFocus={() => {
//                                                 form.clearErrors("lastName");
//                                             }}
//                                             onChange={(e) => {
//                                                 field.onChange(e);
//                                             }}
//                                             onBlur={() => {
//                                                 field.onBlur();
//                                             }}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="email"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <div className='flex justify-between'>
//                                     </div>
//                                     <FormLabel>Email</FormLabel>

//                                     <FormControl>
//                                         <Input placeholder="" {...field}
//                                             onFocus={() => {
//                                                 form.clearErrors("email");
//                                             }}
//                                             onChange={(e) => {
//                                                 field.onChange(e);
//                                             }}
//                                             onBlur={() => {
//                                                 field.onBlur();
//                                             }} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <FormField
//                             control={form.control}
//                             name="contact_info"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <div className='flex justify-between'>
//                                     </div>
//                                     <FormLabel>Contact Information</FormLabel>

//                                     <FormControl>
//                                         <Input placeholder="123-456-8888" {...field}
//                                             onFocus={() => {
//                                                 form.clearErrors("contact_info");
//                                             }}
//                                             onChange={(e) => {
//                                                 field.onChange(e);
//                                             }}
//                                             onBlur={() => {
//                                                 field.onBlur();
//                                             }} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <FormField
//                             control={form.control}
//                             name="address"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <div className='flex justify-between'>
//                                     </div>
//                                     <FormLabel>Address</FormLabel>

//                                     <FormControl>
//                                         <Input placeholder="e.g: 123 Main St, Little Rock, AR" {...field}
//                                             onFocus={() => {
//                                                 form.clearErrors("address");
//                                             }}
//                                             onChange={(e) => {
//                                                 field.onChange(e);
//                                             }}
//                                             onBlur={() => {
//                                                 field.onBlur();
//                                             }} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <Button className="mt-5 bg-black text-white hover:bg-black/70 w-full" type="submit">Create Account</Button>
//                     </form>
//                 </Form>
//             </div>
//         </main>

//     )
// }

// export default RequestProfile


const RequestProfile = () => {
  return (
    <div>RequestProfile</div>
  )
}

export default RequestProfile