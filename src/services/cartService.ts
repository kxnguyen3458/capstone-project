import type { AxiosInstance } from "axios";
import { format } from "date-fns";
import type { CartItem } from "@/store/cartStore";
import { CART_URL, CHECK_AVAILABILITY_ON_SPECIFIC_DAY_URL } from "@/constants";
import { api } from "@/api/axios";
import axios from "axios";

export interface AvailableSlot {
  time: string;
  is_available: boolean;
}

interface AvailabilityResponse {
  vendor_id: string;
  service_id: string;
  date: string;
  slots: AvailableSlot[];
}

export const fetchAvailability = async (
  vendor_id: string,
  service_id: string,
  date: Date | undefined
): Promise<AvailableSlot[]> => {
  if (!vendor_id || !service_id || !date) return [];

  const dateStr = format(date, "yyyy-MM-dd");

  try {
    const res = await api.get<AvailabilityResponse>(
      CHECK_AVAILABILITY_ON_SPECIFIC_DAY_URL,
      {
        params: { vendor_id, service_id, date: dateStr },
      }
    );

    return res.data.slots ?? [];
  } catch (error: any) {
    const status = error?.response?.status;
    const data = error?.response?.data;

    const detail =
      data?.detail ||
      (typeof data === "string" ? data : "Failed to fetch availability");

    if (status === 400 || status === 404) {
      throw new Error(detail);
    }

    throw new Error(`Failed to fetch availability: ${detail}`);
  }
};


export type CartItemDTO = {
  id: string;
  preferredDate: string;
  preferredTime: string;
  service_id: string;
  vendor_id: string;

  name: string;
  description: string;
  price: string;
  duration: number;
};

export type CartItemInputDTO = {
  preferredDate: string;
  preferredTime: string;
  service_id: string;
  vendor_id: string;

  name: string;
  description: string;
  price: string;
  duration: number;
};

export type CartApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "UNKNOWN";

export type FieldErrors = Record<string, string[]>;

export class CartApiError extends Error {
  code: CartApiErrorCode;
  status?: number;
  fieldErrors?: FieldErrors;

  constructor(
    message: string,
    code: CartApiErrorCode,
    options?: { status?: number; fieldErrors?: FieldErrors }
  ) {
    super(message);
    this.name = "CartApiError";
    this.code = code;
    this.status = options?.status;
    this.fieldErrors = options?.fieldErrors;
  }
}

function parseApiDate(dateStr: string): Date {
  return new Date(dateStr);
}

function formatDateForApi(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function normalizePreferredTimeFromApi(time: string): string {
  const parts = time.split(":");
  if (parts.length < 2) return time;
  const [h, m] = parts;
  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
}

export const mapDtoToCartItem = (item: CartItemDTO): CartItem => ({
  clientId: crypto.randomUUID(),
  id: item.id,
  preferredDate: parseApiDate(item.preferredDate),
  preferredTime: normalizePreferredTimeFromApi(item.preferredTime),
  service_id: item.service_id,
  vendor_id: item.vendor_id,

  name: item.name,
  description: item.description,
  price: item.price,
  duration: item.duration,
});

function parseDRF400Error(data: any): {
  message: string;
  fieldErrors?: FieldErrors;
} {
  if (!data || typeof data !== "object") {
    return { message: "Bad Request." };
  }

  if (typeof data.detail === "string") {
    return { message: data.detail };
  }

  const fieldErrors: FieldErrors = {};

  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      fieldErrors[key] = value.map((v) => String(v));
    }
  }

  const flat: string[] = [];

  for (const [field, msgs] of Object.entries(fieldErrors)) {
    flat.push(`${field}: ${msgs.join(" | ")}`);
  }

  return {
    message: flat.join("\n") || "Bad Request.",
    fieldErrors: Object.keys(fieldErrors).length ? fieldErrors : undefined,
  };
}

function handleCartApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as any;

    if (status === 400) {
      const parsed = parseDRF400Error(data);
      throw new CartApiError(parsed.message, "BAD_REQUEST", {
        status,
        fieldErrors: parsed.fieldErrors,
      });
    }

    if (status === 401 || status === 403 || status === 404) {
      const detail =
        typeof data?.detail === "string"
          ? data.detail
          : `Request failed with status ${status}.`;

      const code =
        status === 401
          ? "UNAUTHORIZED"
          : status === 403
          ? "FORBIDDEN"
          : "NOT_FOUND";

      throw new CartApiError(detail, code, { status });
    }

    const msg =
      (typeof data?.detail === "string" && data.detail) ||
      "An unexpected error occurred.";

    throw new CartApiError(msg, "UNKNOWN", { status });
  }

  throw new CartApiError("An unexpected error occurred.", "UNKNOWN");
}



export async function fetchCartByCustomer(apiPrivate: AxiosInstance) {
  try {
    const res = await apiPrivate.get<CartItemDTO[]>(CART_URL);
    return res.data.map(mapDtoToCartItem);
  } catch (error) {
    handleCartApiError(error);
  }
}

export async function createCartItem(
  apiPrivate: AxiosInstance,
  item: Omit<CartItem, "clientId" | "id">
) {
  const dto: CartItemInputDTO = {
    preferredDate: formatDateForApi(item.preferredDate),
    preferredTime: item.preferredTime,
    service_id: item.service_id,
    vendor_id: item.vendor_id,
    name: item.name,
    description: item.description,
    price: item.price,
    duration: item.duration,
  };

  try {
    const res = await apiPrivate.post<CartItemDTO>(CART_URL, dto);
    return mapDtoToCartItem(res.data);
  } catch (error) {
    handleCartApiError(error);
  }
}

export async function updateCartItem(
  apiPrivate: AxiosInstance,
  id: string,
  item: Omit<CartItem, "clientId" | "id">
) {
  const dto: CartItemInputDTO = {
    preferredDate: formatDateForApi(item.preferredDate),
    preferredTime: item.preferredTime,
    service_id: item.service_id,
    vendor_id: item.vendor_id,
    name: item.name,
    description: item.description,
    price: item.price,
    duration: item.duration,
  };

  try {
    const res = await apiPrivate.patch<CartItemDTO>(`/api/cart/${id}/`, dto);
    return mapDtoToCartItem(res.data);
  } catch (error) {
    handleCartApiError(error);
  }
}

export async function deleteCartItemAPI(
  apiPrivate: AxiosInstance,
  id: string
) {
  try {
    await apiPrivate.delete(`/api/cart/${id}/`);
  } catch (error) {
    handleCartApiError(error);
  }
}
