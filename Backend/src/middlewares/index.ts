import type { NextFunction, Request, Response } from "express"
import { z, ZodError } from "zod";

export function validateQuery<T extends z.ZodTypeAny>(schema: T) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.query);
            next();
        } catch (error) {
            if (error instanceof ZodError)
                res.status(400).json({
                    error: 'Erro de validacao',
                    detalhes: z.treeifyError(error)
                })
        }
    }
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

export function validateParams<T extends z.ZodTypeAny>(schema: T) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.params);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    error: 'Erro de validação',
                    detalhes: z.treeifyError(error)
                })
            }
            next(error);
        }
    }
}
