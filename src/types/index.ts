export const ROLES = ["customer", "vendor"] as const;
export type Role = typeof ROLES[number];

// export type User = {
//     email: string,
//     role: Role[]
// }

// export type JwtPayload = {
//     email: string,
//     role: Role[]
// }
export type User= {
    user_id: string
}


export type JwtPayload={
    user_id : string
}