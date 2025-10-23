export const BASE_URL = import.meta.env.VITE_API_BASE_URL as string
export const FRONTEND_BASE_URL = import.meta.env.FRONTEND_BASE_URL as string
export const REGISTER_URL = "/api/auth/register"
export const LOGIN_URL = "/api/auth/token"
export const REQUEST_RESET_PASSWORD = "/api/auth/password-reset"
export const FRONTEND_RESET_URL = `${FRONTEND_BASE_URL}/reset-password`;
export const RESET_PASSWORD_CONFIRM = '/api/auth/password-reset-confirm';
