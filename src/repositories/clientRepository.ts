import prisma from "../config/prismaClient";
import bcrypt from "bcrypt"
import { clientCreate, clientUpdate } from "../models/clientModel";
import { generatedToken } from "../service/authService";
import { verifyExist } from "../utils/index";



export const createClient = async (data: clientCreate) => {
    try {
        const clientVerify: Partial<clientCreate> = {
            email: data.email
        }
        const emailExists = await verifyExist(clientVerify);
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
        throw new Error(error.message || 'Erro ao registrar o cliente');
    }
}

export const updateClient = async (data: clientUpdate, id: string) => {
    try {
        if (data.password) {
            const hashPassword = await bcrypt.hash(data.password, 10);
            data.password = hashPassword;
        }
        const cliente = await prisma.user.update({
            where: { id },
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
                client: {
                    update: {
                        phone: data.phone,
                        dateOfBirth: data.dateOfBirth,
                        preferredGenres: data.preferredGenres
                    }
                }
            },
            include: { client: true }
        })
        return (cliente);
    } catch (error: any) {
        console.error(error.message);
        throw new Error(error.message || 'Erro ao atualizar o cliente');
    }
}

export const getAllClient = async (page: number = 1, limit: number = 10) => {
    try {
        const skip = (page - 1) * limit;
        const [clientes, total] = await Promise.all([
            prisma.user.findMany({
                select: { name: true, email: true, client: true },
                skip,
                take: limit,
                orderBy: { name: 'asc' }
            }),
            prisma.user.count()
        ])
        return {
            data: clientes,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }
    } catch (error: any) {
        console.log(error.message);
        throw new Error(error.message || 'Erro ao listar os clientes')
    }
}

export const getOneClient = async (id?: string, email?: string) => {
    try {
        let client;
        if (id) {
            client = await prisma.user.findUnique({
                where: { id },
                select: { name: true, email: true, client: true }
            })
            if (!client)
                throw new Error("Cliente não encontrado!");
            return (client);
        }
        else if (email) {
            client = await prisma.user.findUnique({
                where: { email },
                select: { name: true, email: true, client: true }
            })
            if (!client)
                throw new Error("Cliente não encontrado!");
            return (client);
        }
        return null;
    } catch (error: any) {
        console.log(error.message);
        throw new Error(error.message || 'Erro ao listar o cliente')
    }
}