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
}



export const isAuthenticated = async (
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



export const isAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new ErrorHandler(401, "You are not logged in for this application. Please login"));
        }

        const userRole = req.user.role;
        

        if ((typeof userRole === 'string' && userRole !== 'admin') ||
            (Array.isArray(userRole) && !userRole.includes('admin'))) {
            return next(new ErrorHandler(401, "Only admin can perform this action."))
        }

        next();
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
}

export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!roles.includes(user.role)) {
            return next(
                new Error(`Role: ${user.role} is not allowed to access this resource`)
            );
        }

        next();
    };
};



