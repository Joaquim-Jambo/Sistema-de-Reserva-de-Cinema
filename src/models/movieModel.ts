export interface movie {
    title: string,
    description: string,
    categoryIds: string[],
    coverImageUrl: string,
    trailerVideoUrl: string,
    duration: string,
    cast: string,
    director: string,
    premiereDate: Date,
    distribuitor: string,
    countryOfOrigin: string
}

export type MovieWithCategories = movie & {
    categoryIds: string[],
    categories: { id: string, name: string }[]
}

export interface movieUpdate {
    title?: string,
    description?: string,
    categoryIds?: string[],
    coverImageUrl?: string,
    trailerVideoUrl?: string,
    duration?: string,
    cast?: string,
    director?: string,
    premiereDate?: Date,
    distribuitor?: string,
    countryOfOrigin?: string
}