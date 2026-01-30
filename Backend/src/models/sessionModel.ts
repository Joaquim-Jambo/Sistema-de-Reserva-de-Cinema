export interface session {
    movieId: string,
    roomId: string,
    data: string,
    price: number
}

export interface sessionFilter {
    data: string,
    id: string,
    movie: string,
    room: string,
    seats: boolean | null
}