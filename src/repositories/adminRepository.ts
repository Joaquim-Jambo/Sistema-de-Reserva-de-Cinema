import bcrypt from "bcrypt"
import prisma from "../config/prismaClient";
import { registerDTO } from "../models/userModel";


export const createAdmin = async (data: registerDTO) => {
    try {
        const emailExists = await prisma.user.findUnique({
            where: { email: data.email }
        });

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
        return admin;
    } catch (error: any) {
        console.error(error.message)
        throw new Error(error.message || 'Erro ao registrar o admin');
    }
}