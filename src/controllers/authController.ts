import { login, register } from "../repositories/authRespository";
import { createUserSchema, loginSchema } from "../schemas/userSchema";
import type { Request, Response } from "express";
import bcrypt from "bcrypt"
import { role } from "../types/roles";
import { responseCreate } from "../models/userModel";

export const registerController = async (req: Request<{}, {}, createUserSchema>, res: Response) => {
    try {
        const { email, password, roleId, name } = req.body;
        const hashPassword = await bcrypt.hash(password, 6);
        const user = await register({ email, password: hashPassword, roleId, name });
        const response: responseCreate = {
            id: user.id,
            email: user.email,
            role: user.roleId as role
        }
        res.status(201).json(response);
    } catch (error: any) {
        if (error.message.includes("registrar")) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Erro interno do servidor" });
    }
}

export const loginController = async (req: Request<{}, {}, loginSchema>, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await login({ email, password });
        res.status(200).json(user);
    } catch (error: any) {
        if (error.message.includes("não encontrado") || error.message.includes("incorreta")) {
            return res.status(401).json({ message: error.message });
        }
    }
}