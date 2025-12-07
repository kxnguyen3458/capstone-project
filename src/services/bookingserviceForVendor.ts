import { EDIT_BOOKING_URL, VENDOR_BOOKING } from "@/constants";
import type { AxiosInstance } from "axios";

export type BookingStatus = "processing" | "awaiting_customer" | "completed";


export type BookingItem = {
  id: string;
  booking_id: string;
  service_id: string;
  vendor_id: string;
  service_name: string;

  customer: {
    address: string;
    contact_info: string;
    email: string;
    fullname: string;
  };

  preferred_date: string;     
  preferred_time: string;      
  duration: number;
  status: BookingStatus;
  vendor_marked_done_at: string | null;
  customer_confirmed_at: string | null;

  date: string;              
  time: string;               
  price: string;               
};

type ApiVendorBookingItem = {
  id: string;
  booking_id: string;
  service_id: string;
  vendor_id: string;
  service_name: string;
  price: string;
  duration: number;
  preferred_date: string;
  preferred_time: string;
  status: string;
  vendor_marked_done_at: string | null;
  customer_confirmed_at: string | null;

  customer: {
    address: string;
    contact_info: string;
    email: string;
    fullname: string;
  };
};

function deriveBookingStatus(item: ApiVendorBookingItem): BookingStatus {
  if (item.customer_confirmed_at) {
    return "completed";
  }
  if (item.vendor_marked_done_at) {
    return "awaiting_customer";
  }
  return "processing";
}

function formatDateTime(
  dateStr: string,
  timeStr: string
): { date: string; time: string } {
  const iso = `${dateStr}T${timeStr}:00`;
  const d = new Date(iso);

  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return { date, time };
}

function formatPrice(rawPrice: string): string {
  const n = Number(rawPrice);
  if (Number.isNaN(n)) return rawPrice;
  return `$${n.toFixed(2)}`;
}

export async function getVendorBookingItems(
  api: AxiosInstance
): Promise<BookingItem[]> {
  const res = await api.get<ApiVendorBookingItem[]>(VENDOR_BOOKING);
  const data = res.data;

  console.log("BOOKING OF VENDOR:", data);

  const items: BookingItem[] = data.map((item) => {
    const status = deriveBookingStatus(item);
    const { date, time } = formatDateTime(
      item.preferred_date,
      item.preferred_time
    );

    return {
      id: item.id,
      booking_id: item.booking_id,
      service_id: item.service_id,
      vendor_id: item.vendor_id,
      service_name: item.service_name,
      customer: item.customer,
      preferred_date: item.preferred_date,
      preferred_time: item.preferred_time,
      duration: item.duration,
      status,
      vendor_marked_done_at: item.vendor_marked_done_at,
      customer_confirmed_at: item.customer_confirmed_at,

      date,
      time,
      price: formatPrice(item.price),
    };
  });

  return items;
}

export async function markBookingItemDone(
  api: AxiosInstance,
  id: string
): Promise<BookingStatus> {
  const res = await api.patch<ApiVendorBookingItem>(
    `${EDIT_BOOKING_URL}${id}/vendor-status/`,
    { status: "vendor_done" }
  );

  const updated = res.data;
  return deriveBookingStatus(updated);
}
