import { createClient } from "../repositories/clientRepository";
import { createClientSchema } from "../schemas/clientSchema";
import type { Request, Response } from "express";

export const createClientController = async (req: Request<{}, {}, createClientSchema>, res: Response) => {
    try {
        const { email, password, name, roleId, phone, preferredGenres, dateOfBirth } = req.body;
        const client = await createClient({ email, password, roleId, phone, preferredGenres, dateOfBirth, name });
        return res.status(201).json(client);
    } catch (error: any) {
        console.error(error);
        if (error.message.includes("registrado"))
            return res.status(401).json({ message: error.message });
        res.status(500).json({ message: 'Erro ao registrar o cliente' });
    }

}