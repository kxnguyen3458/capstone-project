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
import { signupSchema, type SignupSchema } from '@/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import RadioUserType from '../RadioUserType'
import register from '@/services/register'
import { toast } from 'sonner'
import { useLocation, useNavigate } from 'react-router-dom'
import login from "@/services/login"
import useAuth from "@/hooks/useAuth"


function SignupForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setCurrentUser, setAccessToken } = useAuth();


    const from = location.state?.from?.pathname || "/";


    const form = useForm<SignupSchema>({
        resolver: zodResolver(signupSchema),
        mode: "onBlur",
        reValidateMode: "onChange",
        defaultValues: {
            role: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    })

    const handleSubmit = async (data: SignupSchema) => {

        try {
            await register(data);
            const result = await login({
                email: data.email,
                password: data.password
            });

            if (!result) {
                console.log("error, no data return");
                return;
            }
            setAccessToken(result.token);
            setCurrentUser(result.currentUser);


        } catch (error) {
            const err = error as Error
            toast.error(err.message, { description: "Please try again" });
            return;
        }

        const toastId = toast.custom(
            () => (
                <div className='w-screen h-screen flex justify-center items-center bg-white/30 backdrop-blur-sm'>
                    <div className="flex justify-center items-center bg-slate-100 text-black rounded-xl shadow-lg  w-[300px] h-[300px]">
                        <div className='flex flex-col justify-center items-center gap-4 '>
                            <p className=" font-bold text-xl ">Sign up success!</p>
                        </div>
                    </div>
                </div>

            ),
        );

        //go  to home
        setTimeout(() => {
            toast.dismiss(toastId)
            navigate(from, { replace: true });
        }, 2000);
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                                <Input placeholder="Email" {...field}
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
                            <FormMessage />
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
                                <Input placeholder="Password" {...field}
                                    onFocus={() => {
                                        form.clearErrors("password");
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
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <div className='flex justify-between'>
                            </div>
                            <FormControl>
                                <Input placeholder="Confirm Password" {...field}
                                    onFocus={() => {
                                        form.clearErrors("confirmPassword");
                                    }}
                                    onChange={(e) => {
                                        field.onChange(e);
                                    }}
                                    onBlur={() => {
                                        field.onBlur();
                                    }} />
                            </FormControl>
                            <FormMessage className="text-sm" />
                        </FormItem>
                    )}
                />
                <Button className="mt-5 bg-black text-white hover:bg-black/70 w-full" type="submit">Create Account</Button>
            </form>
        </Form>
    )
}

export default SignupForm