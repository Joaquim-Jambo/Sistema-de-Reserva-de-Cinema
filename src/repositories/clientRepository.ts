import prisma from "../config/prismaClient";
import bcrypt from "bcrypt"
import { clientCreate } from "../models/clientModel";


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
        return cliente;
    } catch (error: any) {
        console.error(error.message)
         console.error(error.message)
        throw new Error(error.message || 'Erro ao registrar o client');
    }
}