import { useSearchParams } from 'react-router-dom'
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { resetPassword, type ResetPasswordType } from '@/schemas/auth';
import { RESET_PASSWORD_CONFIRM } from '@/constants';
import { useState } from 'react';
import { toast } from 'sonner';
import ResetPasswordMessage from './message-ui/ResetPasswordMessage';
import { api } from '@/api/axios';


const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [isSuccess, setIsSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const form = useForm<ResetPasswordType>({
        resolver: zodResolver(resetPassword),
        mode: "onChange",
        reValidateMode: "onChange",
        shouldFocusError: true,
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
    })


    const handleSubmit = async (values: ResetPasswordType) => {
        try {
            setIsLoading(true);
            const response = await api.post(RESET_PASSWORD_CONFIRM, {
                uid: searchParams.get('uid'),
                token: searchParams.get("token"),
                new_password: values.password,
                new_password2: values.confirmPassword
            },
            { withCredentials: true }
        )

            if (response.status === 200) {
                setIsSuccess(true);
                setSuccessMessage(response.data.detail);
            }

        } catch (error) {
            toast.error("Error reset password!");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
            {!isSuccess ? (
                <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
                    <div className="w-[500px] min-h-[400px] bg-white shadow-xl rounded-2xl border border-gray-200 flex flex-col justify-center items-center p-10 text-center">
                        <h2 className='text-2xl font-semibold mb-4 text-purple-700'>Enter your new password</h2>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full grid gap-4">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className='flex justify-between'>
                                            </div>
                                            <FormLabel className='text-gray-500 text-sm'>New password</FormLabel>
                                            <FormControl>
                                                <Input  {...field}
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
                                            <FormLabel className='text-gray-500 text-sm' >Confirm password</FormLabel>
                                            <FormControl>
                                                <Input {...field}
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
                                            <FormMessage className='mr-auto text-sm' />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    className="mt-5 w-1/3 ml-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-all"
                                    type="submit" disabled={isLoading}
                                >
                                    Reset password
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            ) : (
                <ResetPasswordMessage message={successMessage} />
            )}
        </div>
    )

}

export default ResetPassword