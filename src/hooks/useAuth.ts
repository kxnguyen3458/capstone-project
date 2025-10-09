import AuthContext from '@/context/AuthProvider'
import  { useContext } from 'react'

const useAuth = () => {
  const context = useContext(AuthContext);
  
  if(context === undefined){
    throw new Error("useAuth must be used inside of a AuthProvider");
  }
  return context;
}

export default useAuth