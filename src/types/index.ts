

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
    contact_info: undefined | string | null;
    formatted_address: string;
    place_id: string;
    latitude: number;
    longitude: number;

}


