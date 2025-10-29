import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { inputProfile, type InputProfile} from '@/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
// import RadioUserType from '../RadioUserType'
// import register from '@/services/register'
// import { toast } from 'sonner'
// import { useLocation } from 'react-router-dom'
import Address from "../Address"


function RequestProfile() {
  // const location = useLocation();

  const form = useForm<InputProfile>({
    resolver: zodResolver(inputProfile),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      contact_info: "",
      address: {
        houseNumber:"",
        street:"",
        city:"",
        zipcode:"",
        state:"AL",
      }
    }
  })

  const handleSubmit = async (data: InputProfile) => {

    // const ouputData = inputProfile.parse(data);
    console.log(data)

  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="" {...field}
                  onFocus={() => {
                    form.clearErrors("firstName");
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  onBlur={() => {
                    field.onBlur();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="" {...field}
                  onFocus={() => {
                    form.clearErrors("lastName");
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  onBlur={() => {
                    field.onBlur();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className='flex justify-between'>
              </div>
              <FormLabel>Email</FormLabel>

              <FormControl>
                <Input placeholder="" {...field}
                  onFocus={() => {
                    form.clearErrors("email");
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  onBlur={() => {
                    field.onBlur();
                  }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact_info"
          render={({ field }) => (
            <FormItem>
              <div className='flex justify-between'>
              </div>
              <FormLabel>Contact Information</FormLabel>

              <FormControl>
                <Input placeholder="123-456-8888" {...field}
                  onFocus={() => {
                    form.clearErrors("contact_info");
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  onBlur={() => {
                    field.onBlur();
                  }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Address prefix = "address"/>
        <Button className="mt-5 bg-black text-white hover:bg-black/70 w-full" type="submit">Create Account</Button>
      </form>
    </Form>


  )
}

export default RequestProfile

