import { login } from "../repositories/authRespository";
import { loginSchema } from "../schemas/userSchema";
import type { Request, Response } from "express";



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