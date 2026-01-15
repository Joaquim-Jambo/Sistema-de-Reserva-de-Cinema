import prisma from "../config/prismaClient"
import { session, sessionFilter } from "../models/sessionModel"
import { filter } from "../types/session";
import { filterGeneric } from "../models";

export const createSession = async (data: session) => {
    try {
        const session = await prisma.session.create({
            data: {
                data: data.data,
                roomId: data.roomId,
                movieId: data.movieId
            }
        })
        return session;
    } catch (error: any) {
        console.error(error.message)
        throw new Error(error.message ? `Erro ao registrar sessão: ${error.message}` : "Erro ao registrar a sessão");
    }
}
export const getAllSession = async (page: number = 1, limit: number = 10) => {
    try {
        const skip = (page - 1) * limit;
        const [sessions, total] = await Promise.all([
            prisma.session.findMany({
                select: {
                    id: true,
                    data: true,
                    movie: { select: { id: true, title: true, description: true } },
                    room: { select: { id: true, number: true } }
                },
                skip,
                take: limit,
                orderBy: { data: 'asc' }
            }),
            prisma.session.count()
        ])
        const response: filterGeneric<typeof sessions> = {
            data: sessions,
            pagination: {
                page,
                limit,
                total,
                totalPage: Math.ceil(total - limit)
            }
        }
        return (response)
    } catch (error: any) {
        console.error(error.message);
        throw new Error(error.message ? `Erro ao listar sessões: ${error.message}` : "Erro ao listar as sessões");
    }
}
type filterHandler = {
    [K in filter]?: (value: any) => Promise<unknown>
}
const handler: filterHandler = {
    dataSession: async (data: Date) => {
        const sessions = await prisma.session.findMany({
            where: { data: { gte: data } },
            include: { movie: { select: { id: true, title: true, description: true } } }
        })
        return sessions
    },
    movie: async (id: string) => {
        const sessions = await prisma.session.findMany({
            where: { movieId: id },
            include: {
                movie: { select: { title: true, description: true, movieCategories: true } }
            }
        })
        return sessions;
    },
    room: async (id: string) => {
        const sessions = await prisma.session.findMany({
            where: { roomId: id },
            include: {
                movie: {
                    select: {
                        id: true, title: true, description: true
                    }
                }
            }
        })
        return (sessions);
    },
    seats: async () => {
        const sessions = await prisma.session.findMany({
            include: { room: true, reservations: true }
        })
        const sessionsWithStats = sessions.map((session) => {
            const confirm = session.reservations.filter((reservation) => reservation.status == 'CONFIRMED').length
            const calc = session.room.capacity - confirm;
            return ({
                ...session,
                availableSeats: calc,
                capacity: session.room.capacity,
                confirm
            })
        }
        )
        return (sessionsWithStats);
    },
    id: async (id: string) => {
        const session = await prisma.session.findUnique({
            where: { id },
            include: { movie: { select: { id: true, title: true, description: true } } }
        })
        return session;
    }
}

export const getSessionByFilter = async (data: Partial<sessionFilter>) => {
    try {
        const key = Object.keys(data)[0] as filter;
        const value = Object.values(data)[0];
        if (handler[key]) {
            return await handler[key](value);
        }
    } catch (error: any) {
        console.error(error.message);
        throw new Error(error.message ? `Erro ao filtrar sessões: ${error.message}` : "Erro ao listar as sessões");
    }
}
