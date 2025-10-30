import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { useEffect, useRef, useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { FRONTEND_RESET_URL, REQUEST_RESET_PASSWORD } from "@/constants";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { toast } from "sonner"
import ForgotPasswordMessage from "./message-ui/ForgotPasswordMessage";
import { api } from "@/api/axios";


const ForgotPassword = () => {
    const [isSent, setIsSent] = useState(false);
    const [currentEmail, setCurrentEmail] = useState<string | null>(null);

    const [successMessage, setSuccessMessage] = useState("")
    const inputRef = useRef<HTMLInputElement | null>(null);
    const formSchema = z.object({
        email: z.string().trim().email("Invalid email")
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    const sendLink = async (email: string) => {
        try {
            const response = await api.post(REQUEST_RESET_PASSWORD, {
                "email": email,
                "frontend_reset_url": `${FRONTEND_RESET_URL}`
            },
                { withCredentials: true }
            )


            if (response.status === 200) {
                setIsSent(true);
                setSuccessMessage(response.data.detail)
            }
            return response;

        } catch (error) {
            console.log(error);
            return;
        }

    }

    const resendLink = async (e: React.MouseEvent<HTMLAnchorElement>, email: string) => {
        e.preventDefault();
        await sendLink(email);
        toast.custom(
            () => (
                <div className='w-screen h-screen flex justify-center items-center bg-white/30 backdrop-blur-sm'>
                    <div className="flex justify-center items-center bg-slate-100 text-black rounded-xl shadow-lg  w-[300px] h-[300px]">
                        <div className='flex flex-col justify-center items-center gap-4 '>
                            <Check className="bg-blue-400 w-15 h-15 rounded-full " />
                            <p className=" font-bold text-xl ">
                                Resend link success!</p>
                        </div>
                    </div>
                </div>

            ),
            { duration: 2000 }
        );
    }

    async function submitEmail(values: z.infer<typeof formSchema>) {
        setCurrentEmail(values.email);
        sendLink(values.email);
    }

    useEffect(() => {
        inputRef.current?.focus();
    }, [])

    return (
        <div className="w-screen h-screen flex justify-center items-center bg-gray-100">

            {!isSent ? (<div className="w-[500px] min-h-[400px] bg-white shadow-xl rounded-2xl border border-gray-200 flex flex-col justify-center items-center p-10 text-center">
                <h2 className="text-3xl font-semibold mb-4 text-purple-700">Forgot your password?</h2>

                <p className="text-gray-600 mb-8 leading-relaxed">
                    Your password will be reset by email.
                </p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submitEmail)} className="w-full">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel >Enter your email address</FormLabel>
                                    <FormControl>
                                        <Input {...field} ref={inputRef} className=""></Input>

                                    </FormControl>
                                    <FormMessage className="mr-auto" />
                                </FormItem>
                            )}
                        />
                        <Button
                            className="mt-8 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-all"
                            type="submit"
                        >
                            Reset password
                        </Button>
                    </form>
                </Form>
                <Link to="/login" className="mt-3 text-sm text-purple-700 hover:underline ">Back to log in</Link>

            </div>)
                : (
                    <ForgotPasswordMessage
                        successMessage={successMessage}
                        currentEmail={currentEmail}
                        resendLink={resendLink}

                    />
                )
            }

        </div>
    );
};

export default ForgotPassword;
