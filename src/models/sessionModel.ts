export interface session {
    movieId: string,
    roomId: string,
    data: string
}

export interface sessionFilter {
    data: string,
    movieId: string,
    roomId: string,
    availableSeats: boolean | string,
    minAvailableSeats: number
}