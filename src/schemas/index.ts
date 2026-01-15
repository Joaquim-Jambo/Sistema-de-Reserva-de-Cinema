import z from "zod";

export const idSchema = z.object({
    id: z.string().uuid({ message: "O id deve ser uuid" })
})

export type idSchema = z.infer<typeof idSchema>