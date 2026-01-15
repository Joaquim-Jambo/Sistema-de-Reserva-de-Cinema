import z from "zod";

export const createCategorySchema = z.object({
    name: z.string()
})
export const filterCategoriesSchema = z.object({
    page: z.string().default("1"),
    limit: z.string().default("10")
})


export type createCategorySchema = z.infer<typeof createCategorySchema>
export type filterCategoriesSchema = z.infer<typeof filterCategoriesSchema>