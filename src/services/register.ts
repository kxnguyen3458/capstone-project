import { api } from './../api/axios';
import axios from "axios";
import { REGISTER_URL } from "@/constants";
import type { SignupSchema } from "@/schemas/auth";


const register = async (data: SignupSchema) => {


    try {
        return await api.post(REGISTER_URL, data, { withCredentials: true });
        // return await api.post(REGISTER_URL, data);


    } catch (err) {

        // if (axios.isAxiosError(err) && err.response) {
        //     if (err.response?.status === 409) {
        //         const errors = err.response?.data as Record<string,string[]>;

        //         Object.entries(errors).forEach(([field, messages]) => {
        //             if (field === "password") {
        //                 throw new Error(messages[0]);
        //             } else {
        //                 throw new Error(messages[0])
        //             }
        //         })
        //     }

        if (axios.isAxiosError(err) && err.response) {
            const errors = err.response.data as Record<string, string[]>;

            
            if (errors.password) {
                throw new Error(errors.password.join(" "));
            }

            throw new Error("Registration failed");
        



    } else {
        // Error not from  axios
        console.error("Unexpected error:", err);
        throw new Error("Network error. Please try again");
    }

}




}

export default register