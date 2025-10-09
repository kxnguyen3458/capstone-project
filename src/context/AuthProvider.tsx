
import type { User } from "@/types";
import { createContext, useState, type PropsWithChildren } from "react"


type AuthContextValue = {
    currentUser?: User | null;
    accessToken?: string |null;
    setAccessToken: React.Dispatch<React.SetStateAction<string | null | undefined>>;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null | undefined>>; 
    
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);


export const AuthProvider = ({children}:PropsWithChildren) => {
  
    const [currentUser, setCurrentUser] = useState<User |null>();
    const [accessToken, setAccessToken] = useState<string | null>();
    


    const value: AuthContextValue = {currentUser, accessToken,setCurrentUser,setAccessToken};


    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext;