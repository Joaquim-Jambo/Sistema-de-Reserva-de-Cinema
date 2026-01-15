import { type Request, type Response } from "express"
import { createCategorySchema, filterCategoriesSchema } from "../schemas/categorySchema"
import { createCategory, deleteCategory, getAllCategory, getOneCategory, updateCategory } from "../repositories/categoriesRepository"
import { ZodError } from "zod";
import { idSchema } from "../schemas";
import { id } from "zod/locales";

export const createCategoryController = async (req: Request<{}, {}, createCategorySchema>, res: Response) => {
    try {
        const { name } = req.body;
        const category = await createCategory({ name });
        res.status(201).json(category);
    } catch (error: any) {
        console.error(error);
        if (error.message && error.message.includes("Categoria ja existente")) {
            return res.status(409).json({
                error: true,
                message: "A categoria informada já existe. Por favor, utilize outro nome."
            });
        }
        return res.status(500).json({
            error: true,
            message: "Erro interno do servidor ao criar categoria. Tente novamente mais tarde."
        });
    }
}

export const getAllCategoryController = async (req: Request<{}, {}, {}, filterCategoriesSchema>, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const categories = await getAllCategory(page, limit);
        res.status(200).json(categories);
    } catch (error: ZodError | any) {
        console.error(error);
        if (error instanceof ZodError) {
            return res.status(400).json({
                error: true,
                message: "Parâmetros de consulta inválidos.",
                errors: error.issues
            });
        }
        return res.status(500).json({
            error: true,
            message: error.message || "Erro interno do servidor ao listar categorias."
        });
    }
}

export const updateCategoryController = async (req: Request<idSchema, {}, createCategorySchema, {}>, res: Response) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const category = await updateCategory(name, id);
        res.status(200).json(category);
    } catch (error: any) {
        console.error(error)
        if (error.message.includes("Categoria não encontrada"))
            return res.status(404).json({
                error: true,
                message: error.message
            })
        return res.status(500).json({
            error: true,
            message: " Erro interno do servidor ao actualizar a categoria."
        })
    }
}

export const deleteCategoryController = async (req: Request<idSchema, {}, {}, {}>, res: Response) => {
    try {
        const { id } = req.params;
        await deleteCategory(id);
        res.status(204).json({})
    } catch (error: any) {
        console.error(error)
        if (error.message.includes("Categoria não encontrada"))
            return res.status(404).json({
                error: true,
                message: error.message
            })
        return res.status(500).json({
            error: true,
            message: " Erro interno do servidor ao actualizar a categoria."
        })
    }
}

export const getOneCategoryController = async (req: Request<idSchema, {}, {}, {}>, res: Response) => {
    try {
        const { id } = req.params;
        const category = getOneCategory(id);
        res.status(200).json(category);
    } catch (error: any) {
        console.error(error)
        if (error.message.includes("Categoria não encontrada"))
            return res.status(404).json({
                error: true,
                message: error.message
            })
        return res.status(500).json({
            error: true,
            message: " Erro interno do servidor ao actualizar a categoria."
        })
    }
}