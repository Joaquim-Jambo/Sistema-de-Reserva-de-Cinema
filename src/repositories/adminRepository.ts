import bcrypt from "bcrypt"
import prisma from "../config/prismaClient";
import { registerDTO } from "../models/userModel";
import { generatedToken } from "../service/authService";
import { clientCreate } from "../models/clientModel";
import { verifyExist } from "../utils";


export const createAdmin = async (data: registerDTO) => {
    try {
        const clientVerify: Partial<clientCreate> = {
            email: data.email
        }
        const emailExists = await verifyExist(clientVerify);
        if (emailExists) {
            throw new Error('Email já foi registrado');
        }
        const hashPassword = await bcrypt.hash(data.password, 10);
        const admin = await prisma.user.create({
            data: {
                email: data.email,
                password: hashPassword,
                roleId: data.roleId,
                name: data.name
            }
        })
        const token = generatedToken({ userId: admin.id, roleId: admin.roleId, email: admin.email });
        const response = {
            ...admin,
            token
        }
        return response;
    } catch (error: any) {
        console.error(error.message)
        throw new Error(error.message || 'Erro ao registrar o admin');
    }
}