export interface clientCreate {
    name: string,
    email: string,
    password: string,
    preferredGenres?: string[],
    roleId: string,
    phone: string,
    dateOfBirth: string
}


export interface clientUpdate{
    name?: string,
    email?: string,
    password?: string,
    preferredGenres?: string[],
    phone?: string,
    dateOfBirth?: string
}