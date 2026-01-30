export interface filterGeneric<T extends Record<string, any>> {
    data: T,
    pagination: {
        page: number,
        limit: number,
        total: number,
        totalPage: number
    }
}