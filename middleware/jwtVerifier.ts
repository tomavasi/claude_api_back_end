import { Response, Request, NextFunction, RequestHandler } from "express";
import 'dotenv/config';
import tokenGenerator from "../tokens/tokenGenerator";

export const jwtVerifier: RequestHandler = (req: Request, res: Response, next: NextFunction) => {

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            res.status(401).json({ msg: "Unauthorized" });
        } else {
            const token = authHeader.split(' ')[1];
            const { err, decoded } = tokenGenerator.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string);
            if (err) {
                res.status(403).json({ msg: "Forbidden" });
            } else {
                req.body.email = decoded?.payload;
                next();
            }
        }
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}
