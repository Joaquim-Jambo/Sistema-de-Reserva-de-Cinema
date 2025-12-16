import type { NextFunction, Request, Response } from "express";
import { UserRole } from "../models/user.model";
import { db } from "../db/db";

export interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const checkRoles = (roles: UserRole[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId as string;
            const foundUser = db.users.find((user) => user.id == userId);
            if (!foundUser) {
                throw new Error("User not found");
            };

            if (!roles.includes(foundUser.role)) {
                return res.status(403).json({ error: 'Access denined' });
            }

            next();

        } catch (error) {
            next(error);
        }
    }
}