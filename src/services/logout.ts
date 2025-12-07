import { api } from "@/api/axios";
import { LOGOUT } from "@/constants";



export async function logoutService() {
  try {
    await api.post(LOGOUT, {}, { withCredentials: true });

  } catch (e) {
    console.warn("logout api failed (ignored)", e);
  } 
}
