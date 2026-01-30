import z from "zod";

export const createMovieSchema = z.object({
    title: z.string(),
    description: z.string(),
    categoryIds: z.string().array(),
    trailerVideoUrl: z.url(),
    coverImageUrl: z.url(),
    duration: z.string(),
    cast: z.string(),
    distribuitor: z.string(),
    countryOfOrigin: z.string(),
    premiereDate: z.coerce.date(),
    director: z.string()
})

export const updateMovieSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    categoryIds: z.string().array().optional(),
    trailerVideoUrl: z.url().optional(),
    coverImageUrl: z.url().optional(),
    duration: z.string().optional(),
    cast: z.string().optional(),
    distribuitor: z.string().optional(),
    countryOfOrigin: z.string().optional(),
    premiereDate: z.coerce.date().optional(),
    director: z.string().optional()
})

export const filterMovieSchema = z.object({
    category: z.string().optional(),
    id: z.uuid().optional()
})

export type createMovieSchema = z.infer<typeof createMovieSchema>
export type updateMovieSchema = z.infer<typeof updateMovieSchema>
export type filterMovieSchema = z.infer<typeof filterMovieSchema>