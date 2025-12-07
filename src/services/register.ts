import { api } from './../api/axios';
import axios from "axios";
import { REGISTER_URL } from "@/constants";
import type { SignupSchema } from "@/schemas/auth";


const register = async (data: SignupSchema) => {


    try {
        return await api.post(REGISTER_URL, data, { withCredentials: true });


    } catch (err) {


        if (axios.isAxiosError(err) && err.response) {
            const errors = err.response.data as Record<string, string[]>;

            
            if (errors.password) {
                throw new Error(errors.password.join(" "));
            }

            throw new Error("Registration failed");
        



    } else {
        console.error("Unexpected error:", err);
        throw new Error("Network error. Please try again");
    }

}




}

export default register