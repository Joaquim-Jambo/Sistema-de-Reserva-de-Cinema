import { createAdmin } from "../repositories/adminRepository";
import { createUserSchema } from "../schemas/userSchema";
import type { Request, Response } from "express";

export const createAdminController = async (req: Request<{}, {}, createUserSchema>, res: Response) => {
    try {
        const { email, password, name, roleId } = req.body;
        const admin = await createAdmin({ name, email, password, roleId });
        res.status(201).json({ message: admin });
    } catch (error: any) {
        console.error(error.message);
        if (error.message && error.message.includes("registrado")) {
            return res.status(409).json({
                error: true,
                message: "O e-mail informado já está cadastrado. Por favor, utilize outro e-mail."
            });
        }
        return res.status(500).json({
            error: true,
            message: "Erro interno do servidor ao criar admin. Tente novamente mais tarde."
        });
    }
} 