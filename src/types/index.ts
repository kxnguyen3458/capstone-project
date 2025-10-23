// export const ROLES = ["customer", "vendor"] as const;
// export type Role = typeof ROLES[number];
export type Role= "customer"| "vendor"

export type User= {
    user_id: number,
    email: string,
    role: Role
}


export type JwtPayload={
    user_id : number,
    email: string,
    role: Role
}