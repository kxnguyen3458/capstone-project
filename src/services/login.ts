import { api } from './../api/axios';
import axios from "axios";
import {LOGIN_URL } from "@/constants";
import type { LoginSchema } from "@/schemas/auth";
import type { JwtPayload, User } from "@/types";
import { jwtDecode } from "jwt-decode";
// import { mockLoginApi } from '@/test/mockApi';



const login = async (data: LoginSchema) => {

    try {
         const response = await api.post(LOGIN_URL, data, {withCredentials:true});


        const token:string =  response.data.access;
        if (!token) {
            throw new Error("No token returned from backend");
        }

        const {user_id, email, role} = jwtDecode<JwtPayload>(token);
        const currentUser: User = {
            user_id,
            email,
            role
        }

        return { token, currentUser }


    } catch (err) {

        if (axios.isAxiosError(err) && err.response) {
            if (err.response?.status === 401) {
                throw new Error("No active account found with the given credentials")

            }
        } else {
            console.error("Unexpected error:", err);
            throw new Error("Network error. Please try again");
        }

    }

}

export default login