import { api } from '@/api/axios';
import useAuth from './useAuth'

const useRefreshToken = () => {

    const {setAccessToken} = useAuth();

    const refresh = async()=>{
      const response = await api.get("api/auth/token/refresh/",{
        withCredentials:true
      });

      // const response = await api.get("api/auth/token/refresh/");




      setAccessToken(response.data.access);

      return response.data.access
    }
    

  return refresh;
}

export default useRefreshToken