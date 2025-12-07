import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import LoginForm from '@/components/auth/LoginForm'
import SignupForm from '@/components/auth/SignupForm'
import { useNavigate, useSearchParams } from 'react-router-dom'

const AuthenticationPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    if(!searchParams.get("tab")) setSearchParams({tab:"login"}, {replace:true});
    const currentTab = searchParams.get("tab") === "register" ? "register" : "login";

    return (
        <div className='w-screen flex justify-center items-center h-screen'>
            <div className="mx-auto
            border border-white/20 rounded-xl shadow-lg backdrop-blur-md
            w-[500px] min-h-[600px] max-w-lg flex-col gap-6 bg-slate-200" >
                <Tabs className='p-8' value={currentTab} 
                onValueChange={(value) => navigate(`/auth?tab=${value}`, {replace:true})}>
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