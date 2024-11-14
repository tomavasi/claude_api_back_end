import jwt, { Jwt } from "jsonwebtoken";
import { Response, Request, NextFunction, RequestHandler } from "express";
import 'dotenv/config';
import tokenGenerator from "../tokens/tokenGenerator";

export const jwtVerifier: RequestHandler = (req: Request, res: Response, next: NextFunction) => {

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            res.status(401).json({ message: "Unauthorized" });
        } else {
            const token = authHeader.split(' ')[1];
            const { err } = tokenGenerator.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string);
            if (err) {
                res.status(403).json({ message: "Forbidden" });
            } else {
                next();
            }
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
