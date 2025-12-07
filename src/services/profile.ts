import { PROFILE_URL } from "@/constants"
import type { ProfileForm } from "@/schemas/auth";
import type { UserProfile } from "@/types";
import type { AxiosInstance } from "axios";
import axios from "axios";


export const getProfileService = async ( apiPrivate: AxiosInstance) :Promise<UserProfile | null> => {

    try {

        const res = await apiPrivate.get(PROFILE_URL);


        if (!res.data) {
            throw new Error("No data returned");
        }
        return res.data;

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const message = error.response.data?.detail || "Something went wrong";

            switch (error.response.status) {
                case 400:
                    throw new Error(message);
                case 404:
                    // throw new Error(message);
                    return null;
                case 401:
                    throw new Error("Unauthorized - Please log in.");
                default:
                    throw new Error(message);
            }
        }
        throw error;
    }
}







//*******************************MOCK************************************** */
// export type ProfileResponse = {
//   name: string;
//   contact_info: string;
//   email: string;
//   address: string;
// };



// const mockProfile = {
//   fullname: "John Doe",
//   contact_info: "+1 234 567 890",
//   email: "john.doe@example.com",
//   formatted_address: "113 Lagrue, Springfield, USA"
// };

// // Mock function to simulate your getProfileService
// export const getProfileService = async (): Promise<ProfileResponse> => {
//   await new Promise((r) => setTimeout(r, 300));

//   return {
//     name: "John Doe",
//     contact_info: "+84 912 345 678",
//     email: "john.doe@example.com",
//     address: "113 Lagrue Dr, Sherwood, Arkansas, 72120",
//   };
// };


//*******************************END OF MOCK************************************** */

export type CustomError = {
    message?: string,
    fieldErrors?: Record<string, string>;
}


export const updateProfileService = async ( apiPrivate: AxiosInstance, payload: ProfileForm) => {

    try {
        const res = await apiPrivate.put(PROFILE_URL, payload);


        if (!res.data) {
            throw new Error("No data returned");
        }
        return res.data;
    } catch (error: any) {

        if (axios.isAxiosError(error) && error.response) {
            const { status, data } = error.response;
            if (status === 401) {
                throw new Error("Session expired. Please log in again.");
            }
            if (status === 400) {
                const err: CustomError = {};
                if (typeof data?.detail === "string") err.message = data.detail;

                if (Array.isArray(data?.non_field_errors) && data.non_field_errors.length) {
                    err.message = err.message ?? String(data.non_field_errors[0]);
                }

                const fields: Record<string, string> = {}
                if (data && typeof data === "object") {
                    Object.entries(data).forEach(([key, value]) => {
                        if (key === "detail" || key === "non_field_errors") return;
                        fields[key] = Array.isArray(value) ? String(value[0]) : String(value);
                    });
                }
                if (Object.keys(fields).length) err.fieldErrors = fields;

                throw err;
            }
        }
        throw new Error("Network error. Please try again.");

    }
}