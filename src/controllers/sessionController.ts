import { type Request, type Response } from "express"
import { createSessionSchema } from "../schemas/sessionSchema"
import { createSession, getAllSession, getSessionByFilter } from "../repositories/sessionRepository"
import { sessionFilter } from "../models/sessionModel";

export const createSessionController = async (req: Request<{}, {}, createSessionSchema>, res: Response) => {
    try {
        const { movieId, roomId, data } = req.body;
        const session = await createSession({ movieId, roomId, data: data.toISOString() });
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

export const getSessionByFilterController = async (req: Request, res: Response) => {
    try {
        const filter: Partial<sessionFilter> = {
            data: req.query.data as string,
            movieId: req.query.movieId as string,
            availableSeats: req.query.availableSeats as string,
            minAvailableSeats: parseInt(req.query.availableSeats as string),
            id: req.query.id as string
        };
        const sessions = getSessionByFilter(filter);
        res.status(200).json(sessions);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Erro interno do servidor ao filtrar sessões."
        });
    }
}