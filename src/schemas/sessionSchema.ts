import { z } from "zod";

export const createSessionSchema = z.object({
    movieId: z.string(),
    roomId: z.string(),
    data: z.coerce.date()
})

export const updateSessionSchema = z.object({
    data: z.coerce.date()
})
export type createSessionSchema = z.infer<typeof createSessionSchema>

export type updateSessionSchema = z.infer<typeof updateSessionSchema>