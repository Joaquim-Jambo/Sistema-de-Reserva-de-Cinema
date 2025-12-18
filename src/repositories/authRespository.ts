import prisma from "../config/prismaClient";
import { loginDTO, responseLogin } from "../models/userModel";
import bcrypt from "bcrypt"
import { generatedToken } from "../service/authService";
import { role } from "../types/roles";



export const login = async (data: loginDTO): Promise<responseLogin> => {
    try {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
            include: { role: true }
        })
        if (!user) {
            throw new Error("Usuário não encontrado");
        }
        const isCorrect = await bcrypt.compare(data.password, user.password);
        if (!isCorrect) {
            throw new Error("Senha incorreta");
        }
        const token = generatedToken({ userId: user.id, email: user.email, roleId: user.roleId });
        const response: responseLogin = {
            id: user?.id,
            email: user?.email,
            role: user?.role.role as role,
            token: token
        }
        return (response);
    } catch (error: any) {
        throw new Error(error.message)
    }
}
