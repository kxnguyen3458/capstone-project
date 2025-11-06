import { apiPrivate } from "@/api/axios";
import { PROFILE_URL } from "@/constants"
import type { ProfileForm } from "@/schemas/auth";
import type { AxiosInstance } from "axios";
import axios from "axios";


type ApiAxios = {
    apiPrivate: AxiosInstance;
}

export const getProfileService = async () => {

    try {
        // const res = await apiPrivate.get(PROFILE_URL);

        //mock api
        const res = {
            data: {
                full_name: "Jane Doe",
                email: "jane@example.com",
                contact_info: "5551234567",
                formatted_address: "123 Main St, Dallas, TX 75201",
                place_id: "mock_place_123",
                latitude: 32.7767,
                longitude: -96.7970,
            }
        }

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
                    throw new Error(message);
                case 401:
                    throw new Error("Unauthorized - Please log in.");
                default:
                    throw new Error(message);
            }
        }
        throw error;
    }
}

export type CustomError = {
    message?: string,
    fieldErrors?: Record<string, string>;
}


//bỏ apiprivate vào params
export const updateProfileService = async (payload: ProfileForm) => {

    try {
        // const res = await apiPrivate.put(PROFILE_URL);

        //mock object trả về từ backend
        await new Promise((resolve) => setTimeout(resolve, 400)); // giả lập API call
        return {
            full_name: payload.full_name,
            email: payload.email,
            contact_info: payload.contact_info,
            formatted_address: payload.formatted_address,
            latitude: payload.latitude,
            longitude: payload.longitude,
            place_id: payload.place_id,
        };
        // if (!res.data) {
        //     throw new Error("No data returned");
        // }
        // return res.data;
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