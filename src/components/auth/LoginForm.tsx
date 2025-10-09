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
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'



function LoginForm() {
    const { setCurrentUser, setAccessToken } = useAuth();
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


            

            navigate(from, {replace:true});

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
                                <Input  placeholder="Email" {...field}
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
                                <Input placeholder="Password" {...field}
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
                            <div className='flex justify-end'>
                                <a href="/" className=' text-sm hover:underline hover:decoration-black hover:underline-offset-2'>Forgot your Password?</a>
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