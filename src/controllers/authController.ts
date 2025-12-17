import { register } from "../repositories/authRespository";
import { createUserSchema } from "../schemas/userSchema";
import type { Request, Response } from "express";
import bcrypt from "bcrypt"


export const registerController = async (req: Request<{}, {}, createUserSchema>, res: Response) => {
    try {
        const { email, password, roleId, name } = req.body;
        const hashPassword = await bcrypt.hash(password, 6);
        const user = await register({ email, password: hashPassword, roleId, name });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
}  