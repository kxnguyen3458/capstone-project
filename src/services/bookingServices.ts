

import { BOOKING_URL } from "@/constants";
import type { AxiosInstance } from "axios";


export type BookingCustomer = {
  fullname: string;
  contact_info: string;
  email: string;
  address: string;
};

export type BookingItemInput = {
  service_id: string;
  vendor_id: string;
  preferred_date: string; 
  preferred_time: string; 
};

export type BookingRequest = {
  customer: BookingCustomer;
  items: BookingItemInput[];
};

export type BookingStatus =
  | "processing"
  | "vendor_done"
  | "customer_confirmed"
  | "cancelled";

export type BookingResponseItem = {
  id: string;
  booking_id: string;
  service_id: string;
  vendor_id: string;
  service_name: string;
  price: string; 
  duration: number; 
  preferred_date: string;
  preferred_time: string;
  status: BookingStatus;
  vendor_marked_done_at: string | null;
  customer_confirmed_at: string | null;
};

export type BookingResponse = {
  id: string;
  created_at: string;
  updated_at: string;
  customer: BookingCustomer;
  items: BookingResponseItem[];
};

export type ApiError = Error & {
  status?: number;
  data?: unknown;
};



function throwApiError(status: number, data: any, fallbackMessage: string): never {
  let message = fallbackMessage;


  if (data && typeof data.detail === "string") {
    message = data.detail;
  } else if (status === 400) {
    message = "Bad request";
  } else if (status === 401) {
    message = "Unauthorized";
  } else if (status === 403) {
    message = "Forbidden";
  } else if (status === 404) {
    message = "Not found";
  }

  const error: ApiError = new Error(message);
  error.status = status;
  error.data = data;
  throw error;
}

function handleAxiosError(err: any, fallbackMessage: string): never {
  if (err?.response) {
    const { status, data } = err.response;
    return throwApiError(status, data, fallbackMessage);
  }

  const error: ApiError = new Error("Network error");
  error.status = undefined;
  error.data = undefined;
  throw error;
}

export async function createBooking(
  apiPrivate: AxiosInstance,
  payload: BookingRequest
): Promise<BookingResponse> {
  try {
    const res = await apiPrivate.post<BookingResponse>(BOOKING_URL, payload);
    return res.data;
  } catch (err: any) {

    return handleAxiosError(err, "Failed to create booking");
  }
}


export async function getBookings(
  apiPrivate: AxiosInstance
): Promise<BookingResponse[]> {
  try {
    const res = await apiPrivate.get<BookingResponse[]>(BOOKING_URL);

    return res.data;
  } catch (err: any) {
    return handleAxiosError(err, "Failed to fetch bookings");
  }
}

export async function getBookingById(
  apiPrivate: AxiosInstance,
  bookingId: string
): Promise<BookingResponse> {
  try {
    const res = await apiPrivate.get<BookingResponse>(`${BOOKING_URL}${bookingId}/`);
    return res.data;
  } catch (err: any) {

    return handleAxiosError(err, "Failed to fetch booking");
  }
}


export type CustomerStatusUpdate = "customer_confirmed" | "cancelled";


export async function updateCustomerStatus(
  apiPrivate: AxiosInstance,
  itemId: string,
  status: CustomerStatusUpdate
): Promise<BookingResponseItem> {
  try {
    const res = await apiPrivate.patch<BookingResponseItem>(
      `/api/booking-items/${itemId}/customer-status/`,
      { status }
    );
    return res.data;
  } catch (err: any) {
    return handleAxiosError(err, "Failed to update customer status");
  }
}
