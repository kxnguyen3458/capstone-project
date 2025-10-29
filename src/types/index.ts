

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


