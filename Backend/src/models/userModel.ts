import { role } from "../types/roles";

export interface registerDTO {
    email: string;
    password: string;
    roleId: string;
    name: string;
    isActive?: boolean;
}

export interface tokenPayload {
    userId?: string,
    email?: string,
    roleId?: string
}

export interface loginDTO {
    email: string,
    password: string
}

export interface responseLogin {
    id?: string,
    email?: string,
    role: role,
    token: string
}

export interface responseCreate {
    id?: string,
    email?: string,
    role: role
}