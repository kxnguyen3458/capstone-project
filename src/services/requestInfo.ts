import { REQUEST_VENDOR_INFO } from "@/constants";
import { api as publicApi } from '../api/axios';


export const getVendorInfo = async(vendor_id: string) =>{
    try {
        const res = await publicApi.get(`${REQUEST_VENDOR_INFO}${vendor_id}/`)

        if (!res.data) {
            throw new Error("No data returned");
        }
        return res.data;
    } catch (error) {
        throw new Error("No data return!");
    }
}