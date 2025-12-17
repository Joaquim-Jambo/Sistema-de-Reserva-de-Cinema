import type { NextFunction, Request, Response } from "express"
import { z, ZodError } from "zod";
import prisma from "../config/prismaClient";
import { Roles } from "../types/roles";

export interface AuthenticatedRequest extends Request {
    userId?: string;
}

export function validateBody<T extends z.ZodTypeAny>(schema: T) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    error: 'Erro de validação',
                    detalhes: z.treeifyError(error)
                })
            }
            next(error)
        }
    }
}

export const checkRoles = (allowedRoles: Roles[]) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId as string
            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    role: true,
                    roleId: true
                }
            })
            if (!user || !allowedRoles.includes(user.role.role as Roles))
                return res.status(403).json({ message: "Acesso negado" });

        } catch (error) {
            next(error);
        }
    }
}