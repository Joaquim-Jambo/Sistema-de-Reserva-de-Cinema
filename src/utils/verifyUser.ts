import prisma from "../config/prismaClient";

export const verifyExistUser = async (email: string): Promise<boolean> => {
    try {
        const user = await prisma.user.findUnique({ where: { email } })
        return user ? true : false
    } catch (error: any) {
        console.error(error.message)
        throw new Error('Erro ao buscar o usuario')
    }
}