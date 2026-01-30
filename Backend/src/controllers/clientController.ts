import { clientUpdate } from "../models/clientModel";
import { createClient, getAllClient, getOneClient, updateClient } from "../repositories/clientRepository";
import { createClientSchema, updateClientSchema } from "../schemas/clientSchema";
import { type Request, type Response } from "express";
import { paramsUserSchema } from "../schemas/userSchema";

export const createClientController = async (req: Request<{}, {}, createClientSchema>, res: Response) => {
    try {
        const { email, password, name, roleId, phone, preferredGenres, dateOfBirth } = req.body;
        const client = await createClient({ email, password, roleId, phone, preferredGenres, dateOfBirth, name });
        return res.status(201).json(client);
    } catch (error: any) {
        console.error(error);
        if (error.message.includes("Email já foi registrado")) {
            return res.status(409).json({
                error: true,
                message: "O e-mail informado já está cadastrado. Por favor, utilize outro e-mail."
            });
        }
        return res.status(500).json({
            error: true,
            message: "Erro interno do servidor ao criar cliente. Tente novamente mais tarde."
        });
    }
}
export const getAllClientController = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const clientes = await getAllClient(page, limit);
        res.status(200).json(clientes);
    } catch (error: any) {
        res.status(500).json({
            error: true,
            message: error.message || "Erro interno do servidor ao listar clientes."
        });
    }
}

export const getOneClientController = async (req: Request, res: Response) => {
    try {
        const { id, email } = req.query;
        if (!id && !email) {
            return res.status(400).json({
                error: true,
                message: "É necessário fornecer um ID ou e-mail para buscar o cliente."
            });
        }
        const cliente = await getOneClient(id as string, email as string);
        return res.status(200).json(cliente);
    } catch (error: any) {
        if (error.message.includes("Cliente não encontrado")) {
            return res.status(404).json({
                error: true,
                message: "Cliente não encontrado. Verifique os dados informados."
            });
        }
        return res.status(500).json({
            error: true,
            message: "Erro interno do servidor ao buscar cliente."
        });
    }
}
export const updateClientController = async (req: Request<paramsUserSchema, {}, updateClientSchema>, res: Response) => {
    try {
        const { name, email, password, preferredGenres, phone, dateOfBirth } = req.body;
        const { id } = req.params;
        const data: clientUpdate = {
            name,
            email,
            password,
            preferredGenres,
            phone,
            dateOfBirth
        }
        const clientUpdated = await updateClient(data, id);
        res.status(200).json(clientUpdated);
    } catch (error: any) {
        return res.status(500).json({
            error: true,
            message: "Erro interno do servidor ao atualizar cliente."
        });
    }
}