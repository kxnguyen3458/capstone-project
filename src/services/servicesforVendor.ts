
import type { AxiosInstance } from "axios";
import type { RegisteredService, Service } from "@/types";
import { SERVICES_URL, VENDOR_REGISTERED_SERVICES_URL} from "@/constants";


export const getServicesforVendor = async (api: AxiosInstance) => {
  try {

    const res = await api.get(SERVICES_URL);

    if (!res) {
      alert("No data from backend");
      return;
    }
    return res.data;

  } catch (error) {
    console.log(error);
    return;
  }
};

export const createServiceforVendor = async (
  api: AxiosInstance,
  service: Service
) => {
  if (service.price == null || service.duration == null) {
    throw new Error("Price and duration are required to register a service");
  }
  const payload = {
    service_id: service.id,
    price: service.price,       
    duration: service.duration, 
    is_active: service.is_active,
  };

  try {
    const res = await api.post(
      VENDOR_REGISTERED_SERVICES_URL,   
      payload
    );

    return res.data;
  } catch (error) {
    console.error("Failed to register service for vendor:", error);
    throw error;
  }
};



export const getRegisteredServicesforVendor = async (api: AxiosInstance) => {
  try {
    const res = await api.get(VENDOR_REGISTERED_SERVICES_URL);

    if (!res) {
      alert("No data from backend");
      return;
    }
    return res.data;

  } catch (error:any) {
    const status = error?.response?.status;
    if(status === 403 ) throw new Error("NO_VENDOR_PROFILE");
    throw error;
  }
};



export const patchRegisteredService = async (
  id: string, 
  updatedField: Partial<Pick<RegisteredService, "price" | "duration" | "is_active">>,
  api: AxiosInstance
) => {
  const { price, duration, is_active } = updatedField;

  const payload: {
    service_id: string;
    price?: number;
    duration?: number;
    is_active?: boolean;
  } = {
    service_id: id,
  };

  if (price !== undefined) payload.price = price;
  if (duration !== undefined) payload.duration = duration;
  if (is_active !== undefined) payload.is_active = is_active;

  const res = await api.patch(VENDOR_REGISTERED_SERVICES_URL, payload);

  return res.data as RegisteredService; 
};


export const deleteRegisteredService = async (id: string, api: AxiosInstance) => {
  try {
    const res = await api.delete(VENDOR_REGISTERED_SERVICES_URL, {
      data: {
        service_id: id,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Failed to delete service:", error);
    throw error;
  }
}
