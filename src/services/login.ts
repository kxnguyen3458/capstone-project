import { api } from './../api/axios';
import axios from "axios";
import {LOGIN_URL } from "@/constants";
import type { LoginSchema } from "@/schemas/auth";
import type { JwtPayload } from "@/types";
import { jwtDecode } from "jwt-decode";



const login = async (data: LoginSchema) => {

    try {
        const response = await api.post(LOGIN_URL, data, {withCredentials:true});
        const token =  response.data.access;

        if (!token) {
            throw new Error("No token returned from backend");
        }

        const decodeData = jwtDecode<JwtPayload>(token);
        const currentUser = {
            user_id: decodeData.user_id
        }

        return { token, currentUser }


    } catch (err) {

        if (axios.isAxiosError(err) && err.response) {
            if (err.response?.status === 401) {
                throw new Error("No active account found with the given credentials")

            }
        } else {
            // Error not from  axios
            console.error("Unexpected error:", err);
            throw new Error("Network error. Please try again");
        }

    }

}

export default login