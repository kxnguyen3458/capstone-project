import { BASE_URL } from '@/constants';
import axios , {type AxiosInstance } from 'axios';


//public
export const api:AxiosInstance =  axios.create({
    baseURL:BASE_URL,
})


//private
export const apiPrivate: AxiosInstance =  axios.create({
    baseURL:BASE_URL,
    headers: {"Content-Type":"application/json"},
    withCredentials:true
})

