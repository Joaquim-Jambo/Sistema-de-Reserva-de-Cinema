import { NextFunction, Request, Response } from "express"
import { z, ZodError } from "zod";

export function validateBody<T extends z.ZodTypeAny>(schema: T) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    error: 'Erro de validação',
                    detalhe: z.treeifyError(error)
                })
            }
            next(error)
        }
    }
}