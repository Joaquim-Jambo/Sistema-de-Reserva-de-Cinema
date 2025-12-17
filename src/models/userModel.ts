import { Roles } from "../types/roles";

export interface registerDTO {
    email: string;
    password: string;
    roleId: string;
    name: string;
    isActive?: boolean;
}

export interface tokenPayload {
    userId: string,
    email: string,
    role: Roles
}