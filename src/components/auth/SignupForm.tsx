import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from "lucide-react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { signupSchema, type SignupSchema } from '@/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import RadioUserType from '../RadioUserType'
import register from '@/services/register'
import { toast } from 'sonner'
import {  useNavigate } from 'react-router-dom'
import { useState } from "react"


function SignupForm() {
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);



    const form = useForm<SignupSchema>({
        resolver: zodResolver(signupSchema),
        mode: "onBlur",
        reValidateMode: "onChange",
        defaultValues: {
            role: "customer",
            email: "",
            password: "",
            confirmPassword: ""
        }
    })

    const handleSubmit = async (data: SignupSchema) => {

        try {
            await register(data);
         
        } catch (error) {
            toast.error((error as Error).message);
            return;
        }

        const toastId = toast.custom(
            () => (
                <div className='w-screen h-screen flex justify-center items-center bg-white/30 backdrop-blur-sm'>
                    <div className="flex justify-center items-center bg-slate-100 text-black rounded-xl shadow-lg  w-[300px] h-[300px]">
                        <div className='flex flex-col justify-center items-center gap-4 '>
                            <p className=" font-bold text-xl ">Sign up success!</p>
                            <p className=" font-bold text-xl ">Please log in</p>
                        </div>
                    </div>
                </div>

            ),
        );

        //go  to home
        setTimeout(() => {
            toast.dismiss(toastId)
            navigate("/login", { replace: true });
        }, 2000);
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="h-full space-y-3">
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-md text-purple-700'>I am signing up as a...</FormLabel>
                            <FormControl>
                                <RadioUserType value={field.value} onChange={field.onChange} />
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
                            <FormControl>
                                <Input
                                    autoComplete="off"
                                    placeholder="Email" {...field}
                                    onFocus={() => {
                                        form.clearErrors("email");
                                    }}
                                    onChange={(e) => {
                                        field.onChange(e);
                                    }}
                                    onBlur={() => {
                                        field.onBlur();
                                    }}
                                />
                            </FormControl>
                            <p className="h-4 text-xs text-destructive">
                                {form.formState.errors.email?.message ?? "\u00A0"}
                            </p>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <div className='flex justify-between'>
                            </div>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={showPass ? "text" : "password"}
                                        autoComplete="off"
                                        placeholder="Password"
                                        className="pr-10"
                                        {...field}
                                        onFocus={() => form.clearErrors("password")}
                                        onChange={(e) => field.onChange(e)}
                                        onBlur={field.onBlur}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(!showPass)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </FormControl>
                            <p className="h-4 text-xs text-destructive">
                                {form.formState.errors.password?.message ?? "\u00A0"}
                            </p>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <div className='flex justify-between'>
                            </div>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={showConfirmPass ? "text" : "password"}
                                        autoComplete="off"
                                        placeholder="Confirm Password"
                                        className="pr-10"
                                        {...field}
                                        onFocus={() => form.clearErrors("confirmPassword")}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </FormControl>

                            <p className="h-4 text-xs text-destructive">
                                {form.formState.errors.confirmPassword?.message ?? "\u00A0"}
                            </p>
                        </FormItem>
                    )}
                />
                <Button className="mt-10 bg-black text-white hover:bg-black/70 w-full" type="submit">Create Account</Button>
            </form>
        </Form>
    )
}

export default SignupForm