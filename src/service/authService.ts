import jwt, { type SignOptions } from "jsonwebtoken"
import { tokenPayload } from "../models/userModel"

export const generatedToken = (payload: tokenPayload) => {
    const options: SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn']
    };
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET!,
        options
    );
    return token;
}

export const verifyToken = (token: string): tokenPayload | undefined => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as tokenPayload;
        return decoded;
    } catch (error) {
        console.error("Token invalido");
    }
}