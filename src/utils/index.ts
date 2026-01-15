import prisma from "../config/prismaClient";
import { EntityExists } from "../types";

type handlerTable = {
    [K in EntityExists]?: (value: any) => Promise<boolean>
}

const handler: handlerTable = {
    email: async (email: string) => {
        try {
            const user = await prisma.user.findUnique({
                where: { email }
            })
            return user ? true : false;
        } catch (error) {
            throw new Error(`Erro na verificao do usuario`)
        }
    },
    title: async (title: string) => {
        try {
            const movie = await prisma.movie.findUnique({
                where: { title }
            })
            return movie ? true : false;
        } catch (error) {
            throw new Error(`Erro na verificao do movie`)
        }
    },
    category: async (name: string) => {
        try {
            const category = await prisma.category.findUnique({
                where: { name }
            })
            return category ? true : false;
        } catch (error) {
            throw new Error(`Erro na verificao da categoria`)
        }
    }
}
export const verifyExist = async <T extends Record<string, any>>(Entity: Partial<T>): Promise<boolean> => {
    try {
        const key = Object.keys(Entity)[0] as EntityExists;
        const value = Object.values(Entity)[0];
        if (handler[key])
            return await handler[key](value);
        return false
    } catch (error: any) {
        console.error(error.message);
        throw new Error(error.message || "Erro na verificacao de existencia");
    }
}