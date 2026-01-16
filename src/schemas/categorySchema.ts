import z from "zod";

export const createCategorySchema = z.object({
    name: z.string()
})



export type createCategorySchema = z.infer<typeof createCategorySchema>
