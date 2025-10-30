import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { loginSchema, type LoginSchema } from '@/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import login from '@/services/login'
import useAuth from '@/hooks/useAuth'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"



function LoginForm() {
    const { setCurrentUser, setAccessToken } = useAuth();
    const [showPass, setShowPass] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        mode: "onBlur",
        reValidateMode: "onChange",
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const handleSubmit = async (data: any) => {

        try {
            const result = await login(data);
            if (!result) {
                console.log("error, no data return");
                return;
            }
            setAccessToken(result.token);
            setCurrentUser(result.currentUser);


            navigate(from, { replace: true });

        } catch (error) {
            const err = error as Error
            toast.error(err.message, { description: "Please try again" });
            return;
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input autoComplete="off" placeholder="Email" {...field}
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
                    name="password"
                    render={({ field }) => (
                        <FormItem>
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
                            <div className='flex justify-end'>
                                <Link to="/forgot-password" className=' text-sm hover:underline hover:decoration-black hover:underline-offset-2'>Forgot your Password?</Link>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="bg-black text-white hover:bg-black/70 w-full" type="submit">Login</Button>
            </form>
        </Form>
    )
}

export default LoginForm