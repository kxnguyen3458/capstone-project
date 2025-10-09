import { api } from '@/api/axios';
import useAuth from './useAuth'

const useRefreshToken = () => {

    const {setAccessToken} = useAuth();

    const refresh = async()=>{
      const response = await api.get("api/auth/token/refresh",{
        withCredentials:true
      });
      setAccessToken(response.data.accessToken);

      return response.data.accessToken
    }
    

  return refresh;
}

export default useRefreshToken