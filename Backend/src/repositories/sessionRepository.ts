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
                movieId: data.movieId,
                price: data.price
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
                    room: { select: { id: true, number: true, capacity: true } },
                    reservations: true
                },
                skip,
                take: limit,
                orderBy: { data: 'asc' }
            }),
            prisma.session.count()
        ])
        const sessionsWithStats = sessions.map((session) => {
            const confirm = session.reservations.filter((reservation) => reservation.status == 'CONFIRMED').length
            const calc = session.room.capacity - confirm;
            return ({
                ...session,
                availableSeats: calc,
                capacity: session.room.capacity,
                confirm
            })
        })
        const response: filterGeneric<typeof sessions> = {
            data: sessionsWithStats,
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
    data: async (data: Date) => {
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
    availableSeats: async () => {
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
            console.log(value);
            return await handler[key](value);
        }
    } catch (error: any) {
        console.error(error.message);
        throw new Error(error.message ? `Erro ao filtrar sessões: ${error.message}` : "Erro ao listar as sessões");
    }
}


export const deleteSession = async (id: string) => {
    try {
        const filter: Partial<sessionFilter> = { id }
        await getSessionByFilter(filter);
        await prisma.session.delete({
            where: { id }
        })
    } catch (error: any) {
        console.error(error.message)
        throw new Error(error.message ? `Erro ao deletar sessão: ${error.message}` : "Erro ao deletar a sessão");
    }
}

export const updateSession = async (data: string, id: string) => {
    try {
        const filter: Partial<sessionFilter> = { id }
        await getSessionByFilter(filter);
        const session = await prisma.session.update({
            where: { id },
            data: { data }
        })
        return (session);
    } catch (error: any) {
        console.error(error.message)
        throw new Error(error.message ? `Erro ao deletar sessão: ${error.message}` : "Erro ao deletar a sessão");
    }
}