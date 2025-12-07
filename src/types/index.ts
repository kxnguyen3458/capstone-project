

export type Role = "customer" | "vendor"

export type User = {
  user_id: number,
  email: string,
  role: Role
}


export type JwtPayload = {
  user_id: number,
  email: string,
  role: Role
}

export type UserProfile = {
  user_email: string;
  fullname: string;
  contact_info: string;
  formatted_address: string;
  place_id: string;
  latitude: number;
  longitude: number;
}

export type Service = {
  id: string;
  name: string,
  description: string,
  price: string | null,
  duration: number | null,
  is_active: boolean

}


// export type RegisteredService = {
//   // id: string;
//   vendor_id: string;
//   service_id: string;
//   name: string;
//   description: string;
//   price: number;
//   duration: number;
//   is_active: boolean;
// };

export type RegisteredService = {
  id: string;
  vendor_id: string;
  // service_id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  is_active: boolean;
};


//------------customer base-------------

export type ProvidedService = {
  service_id: string;
  vendor_id: string,
  name: string;
  description: string;
  price: string;
  duration: number;
};




export type VendorInfo = {
  id: string,
  fullname: string,
  contact_info: string,
  formatted_address: string
}

export type ServiceProvidedByVendor = {
  service_id: string;
  vendor_id: string;
  name: string;
  description: string;
  price: string;
  duration: number;
};


/*************************CART********************** */

export type AddToCartItem = {
  preferredDate: Date;
  preferredTime: string;
  service_id: string;
  vendor_id: string;
}

export type CustomerBookingInfo = {
  fullname: string,
  contact_info: string,
  email: string,
  address: string,
}