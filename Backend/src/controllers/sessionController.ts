import { type Request, type Response } from "express"
import { createSessionSchema, updateSessionSchema } from "../schemas/sessionSchema"
import { createSession, deleteSession, getAllSession, getSessionByFilter, updateSession } from "../repositories/sessionRepository"
// import { sessionFilter } from "../models/sessionModel";
import { idSchema } from "../schemas";

export const createSessionController = async (req: Request<{}, {}, createSessionSchema>, res: Response) => {
    try {
        const session = await createSession({ ...req.body, price: req.body.price, data: req.body.data instanceof Date ? req.body.data.toISOString() : req.body.data });
        res.status(201).json(session);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Erro interno do servidor ao criar sessão. Tente novamente mais tarde."
        });
    }
}

export const getAllSessionController = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) | 1;
        const limit = parseInt(req.query.limit as string) | 10;
        const sessions = await getAllSession(page, limit);
        res.status(200).json(sessions);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Erro interno do servidor ao listar sessões."
        });
    }
}
export interface sessionFilter {
    data: string,
    id: string,
    movieId: string,
    roomId: string,
    availableSeats: boolean | string,
    minAvailableSeats: number
}
export const getSessionByFilterController = async (req: Request, res: Response) => {
    try {
        const filter: Partial<sessionFilter> = {
            ...req.query
        }
        const sessions = await getSessionByFilter(filter);
        res.status(200).json(sessions);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Erro interno do servidor ao filtrar sessões."
        });
    }
}
export const deleteSessionController = async (req: Request<idSchema, {}, {}, {}>, res: Response) => {
    try {
        const { id } = req.params;
        await deleteSession(id);
        res.status(204).json({})
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Erro interno do servidor ao filtrar sessões."
        });
    }
}

export const updateSessionController = async (req: Request<idSchema, {}, updateSessionSchema, {}>, res: Response) => {
    try {
        const { data } = req.body;
        const { id } = req.params;
        const sessionUpdated = await updateSession(data.toISOString(), id);
        res.status(200).json(sessionUpdated);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Erro interno do servidor ao deletar sessão."
        });
    }
}