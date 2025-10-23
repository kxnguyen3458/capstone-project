import { Check } from 'lucide-react'
import { Button } from '../ui/button'
import{ Link } from 'react-router-dom'

const ResetPasswordMessage = ({message}:{message:string}) => {
    return (
        <div className="w-[500px] min-h-[400px] bg-white shadow-xl rounded-2xl border border-gray-200 flex flex-col gap-2 justify-center items-center p-10 text-center">
            <Check className="w-15 h-15 text-green-600 mb-5" />
            <h2 className="text-2xl font-bold mb-3">Password Changed!</h2>
            <p className="text-sm text-gray-700">{message}</p>
            <Button
                className="mt-3 ">
                <Link to="/login">Back to Login</Link>
            </Button>
        </div >
    )
}

export default ResetPasswordMessage