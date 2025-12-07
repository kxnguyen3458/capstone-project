// import { formatUUID } from "@/utils"

export const BASE_URL = import.meta.env.VITE_API_BASE_URL as string
export const FRONTEND_BASE_URL = import.meta.env.VITE_FRONTEND_BASE_URL as string
export const REGISTER_URL = "/api/auth/register/"
export const LOGIN_URL = "/api/auth/token/"
export const LOGOUT = "/api/auth/logout/"
export const REQUEST_RESET_PASSWORD = "/api/auth/password-reset/"
export const FRONTEND_RESET_URL = `${FRONTEND_BASE_URL}/reset-password/`;
export const RESET_PASSWORD_CONFIRM = '/api/auth/password-reset-confirm/';
export const REFRESH_TOKEN= "api/auth/token/refresh/";

//*******************PROFILE********************/
export const PROFILE_URL = "/api/profile/"


//*******************SERVICES********************/
export const SERVICES_URL = "/api/services/list/"
export const VENDOR_REGISTERED_SERVICES_URL = "/api/services/vendor/"
export const SERVICES_HOME_PAGE = "/api/services/homepage/";
export const SERVICES_OF_EACH_VENDOR = "/api/services/";


//*************************** REQUEST VENDOR INFORMATION **************/
export const REQUEST_VENDOR_INFO = "/api/vendors/";



// *****************3rd party url**********************
export const GEOAPIFY_URL = "https://api.geoapify.com/v1/geocode/search"
export const apiKey = import.meta.env.VITE_GEO_API_KEY


// *****************IMAGE_BASE**********************
export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL ?? ""

// export const serviceImageURLMap = new Map<string, string>([
//   [formatUUID("f89c4b9fdc53409aa8b3df197b487aeb"), "/servicesImg/oil-change.jpg"],          // oil change
//   [formatUUID("89819a0c959c43caa5a74b93da19ffdc"), "/servicesImg/car-wash.jpg"],            // Exterior Car Wash
//   [formatUUID("dbf4047f18064c86bf968a86a8171a61"), "/servicesImg/interior-clean-up.jpg"],  // interior vacuum
//   [formatUUID("b5de4640998b429cb1be6123d265af42"), "/servicesImg/combo-cleaning.jpg"],      // combo cleaning
//   [formatUUID("044c88d2436f44909434e438841b5bbb"), "/servicesImg/headlights.jpg"],          // headlight restore
//   [formatUUID("4322ae5b81db46a495bad5e273ce240d"), "/servicesImg/engine-diagnosis.jpg"],    // engine diagnosis
//   [formatUUID("f88c18b870a946fbb0cb5f2904f38f9f"), "/servicesImg/battery-replacement.jpg"], // Battery Replacement
//   [formatUUID("42d8f1b593864015a72fe4c0fb9e8f78"), "/servicesImg/ac-refresher.jpg"],        // A/C Refresher
//   [formatUUID("e6f979f0af434000960be7f1c333b5d5"), "/servicesImg/windshield-wiper.jpg"]         //Windshield wiper
//]);

export const serviceImageURLMap = new Map<string, string>([
  ["4152dabf-f664-4331-aa95-5734b25cca42", "/servicesImg/oil-change.jpg"],          // oil change
  ["c3f0371d-0c68-44d4-9be4-3636f534850e", "/servicesImg/car-wash.jpg"],            // Exterior Car Wash
  ["e183c736-b481-4c1a-a96c-5a5d5bdb3aad", "/servicesImg/interior-clean-up.jpg"],  // interior vacuum
  ["c9ca9e39-0ca3-4fca-a90d-0972095a7f0a", "/servicesImg/combo-cleaning.jpg"],      // combo cleaning
  ["85951308-a576-4231-bfac-a7f0ebb42e03", "/servicesImg/headlights.jpg"],          // headlight restore
  ["4cefd018-7274-4cb3-8614-b12e8eedba21", "/servicesImg/engine-diagnosis.jpg"],    // engine diagnosis
  ["ceedfbbf-0533-4a01-bc0a-ce80f2de2007", "/servicesImg/battery-replacement.jpg"], // Battery Replacement
  ["9a20b9b0-b4d5-45d3-8e50-bb8d739820d6", "/servicesImg/ac-refresher.jpg"],        // A/C Refresher
  ["d9d73c46-b753-4fe3-a566-e2ac2f58891c", "/servicesImg/windshield-wiper.jpg"]         //Windshield wiper
]);

// export const serviceCategory = new Map<string, string>([
//   [formatUUID("f89c4b9fdc53409aa8b3df197b487aeb"), "Oil Change"],          // oil change
//   [formatUUID("89819a0c959c43caa5a74b93da19ffdc"), "Exterior Vacuum"],     // Exterior Car Wash
//   [formatUUID("dbf4047f18064c86bf968a86a8171a61"), "Interior Vacuum"],  // interior vacuum
//   [formatUUID("b5de4640998b429cb1be6123d265af42"), "Combo Cleaning"],      // combo cleaning
//   [formatUUID("044c88d2436f44909434e438841b5bbb"), "Headlight Restore"],   // headlight restore
//   [formatUUID("4322ae5b81db46a495bad5e273ce240d"), "Engine Diagnosis"],    // engine diagnosis
//   [formatUUID("f88c18b870a946fbb0cb5f2904f38f9f"), "Battery Replacement"], // Battery Replacement
//   [formatUUID("42d8f1b593864015a72fe4c0fb9e8f78"), "A/C Refresher"],        // A/C Refresher
//   [formatUUID("e6f979f0af434000960be7f1c333b5d5"), "Windshield Wiper"]         //Windshield wiper
// ]);

export const serviceCategory = new Map<string, string>([
  ["4152dabf-f664-4331-aa95-5734b25cca42", "Oil Change"],
  ["c3f0371d-0c68-44d4-9be4-3636f534850e", "Exterior Vacuum"],
  ["e183c736-b481-4c1a-a96c-5a5d5bdb3aad", "Interior Vacuum"],
  ["c9ca9e39-0ca3-4fca-a90d-0972095a7f0a", "Combo Cleaning"],
  ["85951308-a576-4231-bfac-a7f0ebb42e03", "Headlight Restore"],
  ["4cefd018-7274-4cb3-8614-b12e8eedba21", "Engine Diagnosis"],
  ["ceedfbbf-0533-4a01-bc0a-ce80f2de2007", "Battery Replacement"],
  ["9a20b9b0-b4d5-45d3-8e50-bb8d739820d6", "A/C Refresher"],
  ["d9d73c46-b753-4fe3-a566-e2ac2f58891c", "Windshield Wiper"]
]);


/**************************************CHECK AVAILABILIY********************************/
export const CHECK_AVAILABILITY_ON_SPECIFIC_DAY_URL = "/api/availability/slots/";



/**************************************CART********************************/
export const CART_URL = "/api/cart/";


/**************************************BOOKING********************************/
export const BOOKING_URL = "/api/bookings/";

/**************************************EDIT BOOKING********************************/
export const EDIT_BOOKING_URL = "/api/booking-items/"



/**************************************VENDOR BOOKING********************************/
export const VENDOR_BOOKING = "/api/vendor/booking-items/"



