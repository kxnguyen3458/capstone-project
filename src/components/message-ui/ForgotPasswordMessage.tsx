import { Mail } from "lucide-react";
import React from 'react'
import { Link } from "react-router-dom";


type ForgotPasswordMessageProps = {
    successMessage: string,
    currentEmail:string | null,
    resendLink: (e: React.MouseEvent<HTMLAnchorElement>, email: string) => void
}

const ForgotPasswordMessage = ({ successMessage,currentEmail, resendLink }: ForgotPasswordMessageProps) => {
    return (
        <div className="w-[500px] min-h-[400px] bg-white shadow-xl rounded-2xl border border-gray-200 flex flex-col gap-2 justify-center items-center p-10 text-center">
            <Mail className="w-15 h-15 text-purple-700 mb-5" />
            <h2 className="text-2xl font-bold mb-3">Check your email</h2>
            <p className="text-sm text-gray-700">{successMessage} </p>
            <Link to="/login"
                onClick={(e) => currentEmail && resendLink(e, currentEmail)}
                className="mt-3 text-sm text-purple-700 hover:underline ">Resend the link</Link>
        </div>
    )
}

export default ForgotPasswordMessage