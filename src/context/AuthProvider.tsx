
import { apiPrivate } from "@/api/axios";
import { logoutService } from "@/services/logout";
import type { User } from "@/types";
import { createContext, useState, type PropsWithChildren } from "react"
import { useNavigate } from "react-router-dom";


type AuthContextValue = {
  currentUser?: User | null;
  accessToken?: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null | undefined>>;
  logout: () => void

}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);


export const AuthProvider = ({ children }: PropsWithChildren) => {

  const [currentUser, setCurrentUser] = useState<User | null>();
  const [accessToken, setAccessToken] = useState<string | null>();

  const logout = async () => {
    await logoutService();


    setAccessToken(null);
    setCurrentUser(null);

    delete (apiPrivate.defaults.headers as any).common?.Authorization;

    navigate("/");
  }

  const navigate = useNavigate();

  const value: AuthContextValue = { currentUser, accessToken, setCurrentUser, setAccessToken, logout };


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext;