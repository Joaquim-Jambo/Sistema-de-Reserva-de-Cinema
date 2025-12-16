export type UserRole = "Admin" | "Manager" | "User"

export interface User {
    id: string;
    email: string;
    name: string;
    password: string;
    role: UserRole;
}
