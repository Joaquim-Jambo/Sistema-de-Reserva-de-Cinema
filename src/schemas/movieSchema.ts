import z from "zod";

export const createMovieSchema = z.object({
    title: z.string(),
    description: z.string(),
    categoryIds: z.string().array(),
    coverImageUrl: z.string()
})

export type createMovieSchema = z.infer<typeof createMovieSchema>