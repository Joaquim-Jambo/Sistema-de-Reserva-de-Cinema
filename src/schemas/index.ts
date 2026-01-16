import z from "zod";

export const idSchema = z.object({
    id: z.string().uuid({ message: "O id deve ser uuid" })
})

export const filterSchema = z.object({
    page: z.string().default("1"),
    limit: z.string().default("10")
})

export type idSchema = z.infer<typeof idSchema>
export type filterSchema = z.infer<typeof filterSchema>