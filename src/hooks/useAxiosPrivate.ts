
import  { useEffect } from 'react'
import useAuth from './useAuth'
import { apiPrivate } from '@/api/axios';
import useRefreshToken from './useRefreshToken';

const useAxiosPrivate = () => {

    const { accessToken } = useAuth();
    const refresh  = useRefreshToken();

    useEffect(() => {

        const requestInterceptor = apiPrivate.interceptors.request.use(
            (config) => {
                if (!config.headers["Authorization"]) {
                    config.headers["Authorization"] = `Bearer ${accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        )

        const responseInterceptor = apiPrivate.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;
                const status = error?.response?.status;
                if ((status === 403 || status === 401) && !prevRequest._retry) {
                    prevRequest._retry = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    return apiPrivate(prevRequest);
                }
                return Promise.reject(error);
            }

        )
        return () => {
            apiPrivate.interceptors.request.eject(requestInterceptor);
            apiPrivate.interceptors.response.eject(responseInterceptor);
        }

    }, [accessToken, refresh])
    return apiPrivate;
}

export default useAxiosPrivate