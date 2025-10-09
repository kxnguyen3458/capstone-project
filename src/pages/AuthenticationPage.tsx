import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import LoginForm from '@/components/auth/LoginForm'
import SignupForm from '@/components/auth/SignupForm'
import { useLocation, useNavigate } from 'react-router-dom'

const AuthenticationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const pathPart = location.pathname.split('/');
    const current = pathPart[pathPart.length - 1 ]  === "register" ? "register" : "login";
    
   

    return (
        <div className='w-screen flex justify-center items-center h-screen'>
            <div className="mx-auto
            border border-white/20 rounded-xl shadow-lg backdrop-blur-md
            w-[500px] min-h-[500px] max-w-lg flex-col gap-6 bg-slate-200" >
                <Tabs className='p-8' value={current} onValueChange={(value) => navigate(value === "login" ? "/login" : "/register")}>
                    <TabsList  className='mx-auto mb-5 bg-slate-300'>
                        <TabsTrigger value='login'>LogIn</TabsTrigger>
                        <TabsTrigger value='register'>SignUp</TabsTrigger>
                    </TabsList>
                    <TabsContent value='login'>
                        <LoginForm></LoginForm>
                    </TabsContent>
                    <TabsContent value='register'>
                        <SignupForm></SignupForm>
                    </TabsContent>

                </Tabs>

            </div>
        </div>
    )
}

export default AuthenticationPage