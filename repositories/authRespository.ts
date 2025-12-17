import prisma from "../config/prismaClient";
import { User } from "../src/generated/prisma";


export const register = (data: User): Promise<User> => {
    try {
        const user = prisma.user.create({
            data
        })
        return (user);
    } catch (error: any) {
        console.error(error.message)
        throw new Error('Erro ao registrar o usuario');
    }
}