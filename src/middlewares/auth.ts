import type { NextFunction, Request, Response } from "express"
import { z, ZodError } from "zod";
import prisma from "../config/prismaClient";
import { role } from "../types/roles";
import { verifyToken } from "../service/authService";
import { tokenPayload } from "../models/userModel";

export interface AuthenticatedRequest extends Request {
    userId?: string;
    user?: tokenPayload;
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

export const checkRoles = (allowedRoles: role[]) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId;
            if (!userId)
                return res.status(401).json({ message: "Usuário não autenticado" });
            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    role: true,
                    roleId: true
                }
            })
            if (!user || !allowedRoles.includes(user.role.role as role))
                return res.status(403).json({ message: "Acesso negado" });
            next();
        } catch (error) {
            next(error);
        }
    }
}

export const authenticate = () => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            if (!token)
                return res.status(401).json({ message: "Token nao encontrado" });
            const decode = verifyToken(token);
            req.user = decode as tokenPayload;
            req.userId = decode?.userId;
            next();
        } catch (error: any) {
            next(error);
        }
    }
}