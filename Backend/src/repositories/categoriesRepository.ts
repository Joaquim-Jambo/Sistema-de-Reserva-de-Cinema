import prisma from "../config/prismaClient";
import { category } from "../models/categoryModel";
import { verifyExist } from "../utils";

export const createCategory = async (data: category) => {
    try {
        const categoryType: Partial<category> = { name: data.name }
        const categoryExist = await verifyExist(categoryType);
        if (categoryExist)
            throw new Error("Categoria ja existente");
        const category = await prisma.category.create({
            data: {
                name: data.name
            }
        })
        return category;
    } catch (error: any) {
        console.error(error.message);
        throw new Error(error.message || "Erro ao criar a categoria");
    }
}
export const getAllCategory = async (page: number = 1, limit: number = 10) => {
    try {
        const skip = (page - 1) * limit;

        const [categories, total] = await Promise.all([
            prisma.category.findMany({
                select: { movieCategorie: true, name: true, id: true },
                skip,
                take: limit,
                orderBy: { name: 'asc' }
            }),
            prisma.category.count()
        ])
        return ({
            data: categories,
            pagination: {
                page,
                limit,
                total,
                totalPage: Math.ceil(total / limit)
            }
        })
    } catch (error: any) {
        console.error(error.message);
        throw new Error(error.message || "Erro ao listar as categories");
    }
}

export const getOneCategory = async (id: string) => {
    try {
        const category = await prisma.category.findUnique({
            where: { id },
            select:{name: true, id: true, movieCategorie: true}
        })
        if (!category)
            throw new Error("Categoria não encontrada");
        return category;
    } catch (error: any) {
        console.error(error.message);
        throw new Error(error.message ? `Erro ao buscar categoria: ${error.message}` : 'Erro ao buscar a categoria');
    }
}
export const updateCategory = async (name: string, id: string) => {
    try {
        await getOneCategory(id);
        const category = await prisma.category.update({
            where: { id },
            data: { name }
        })
        return category;
    } catch (error: any) {
        console.error(error.message);
        throw new Error(error.message ? `Erro ao atualizar categoria: ${error.message}` : 'Erro ao atualizar a categoria');
    }
}

export const deleteCategory = async (id: string) => {
    try {
        await getOneCategory(id);
        await prisma.category.delete({
            where: { id }
        })
    } catch (error: any) {
        console.error(error.message);
        throw new Error(error.message ? `Erro ao deletar categoria: ${error.message}` : 'Erro ao deletar a categoria');
    }
}