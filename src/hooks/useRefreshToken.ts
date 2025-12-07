import { api } from '@/api/axios';
import useAuth from './useAuth'

const useRefreshToken = () => {

    const {setAccessToken} = useAuth();

    const refresh = async()=>{
      const response = await api.post("api/auth/token/refresh/",{
        withCredentials:true
      });


      setAccessToken(response.data.access);

      return response.data.access
    }
    

  return refresh;
}

export default useRefreshToken