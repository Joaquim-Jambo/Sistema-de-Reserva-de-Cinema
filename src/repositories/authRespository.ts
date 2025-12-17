import prisma from "../config/prismaClient";
import { registerDTO } from "../models/userModel";
import { User } from "../generated/prisma";


export const register = async (data: registerDTO): Promise<User> => {
    try {
        const user = await prisma.user.create({ data })
        return user;
    } catch (error: any) {
        console.error(error.message)
        throw new Error('Erro ao registrar o usuário');
    }
}