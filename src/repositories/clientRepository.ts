import prisma from "../config/prismaClient";
import bcrypt from "bcrypt"
import { clientCreate } from "../models/clientModel";
import { generatedToken } from "../service/authService";


export const createClient = async (data: clientCreate) => {
    try {

        const emailExists = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (emailExists) {
            throw new Error('Email já foi registrado');
        }
        const hashPassword = await bcrypt.hash(data.password, 10);
        const cliente = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashPassword,
                roleId: data.roleId,
                client: {
                    create: {
                        phone: data.phone,
                        dateOfBirth: data.dateOfBirth,
                        preferredGenres: data.preferredGenres
                    }
                }
            },
            include: { client: true, role: true }
        })
        const token = generatedToken({ userId: cliente.id, email: cliente.email, roleId: cliente.roleId })
        const response = {
            ...cliente,
            token
        }
        return response;
    } catch (error: any) {
        console.error(error.message)
        throw new Error(error.message || 'Erro ao registrar o client');
    }
}