import { NextFunction, Request, Response } from "express";
import { AuthPayload } from "../types";
import { ErrorHandler } from "../utils";
import jwt, { JwtPayload } from "jsonwebtoken"

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
} export const isAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;

        const authHeaderString = Array.isArray(authHeader)
            ? authHeader[0]
            : authHeader;

        if (!authHeaderString?.startsWith("Bearer ")) {
            return next(new ErrorHandler(401, "Invalid authorization. Please provide a valid token."));
        }

        const token = authHeaderString.split(" ")[1];

        if (!token) return next(new ErrorHandler(401, "Invalid authorization. Please provide a valid token."));

        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET as string
        ) as JwtPayload;

        if (!decoded) {
            return next(new ErrorHandler(403, "Invalid token"))
        }

        req.user = decoded as AuthPayload;
        next();
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }

};

