import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../utils";

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    error.statusCode = error.statusCode || 500
    error.message = error.message || "Internal server error"

    // Wrong mongodb id error
    if (error.name === "CastError") {
        const message = `Resources not found with this id.. Invalid ${error.path}`;
        error = new ErrorHandler(400, message)
    }

    // Duplicate key error
    if (error.code === 11000) {
        const message = `Duplicate key ${Object.keys(error.keyValue)} entered`;
        error = new ErrorHandler(400, message)
    }

    // Wrong JWT Error
    if (error.name === "TokenExpiredError") {
        const message = 'Invalid JWT. Please provide a valid token.';
        error = new ErrorHandler(400, message)
    }

    // jwt expired
    if (error.name === "TokenExpiredError") {
        const message = 'JWT expired. Please login again.';
        error = new ErrorHandler(400, message)
    }

    res.status(error.statusCode).json({
        success: false,
        message: error.message,
    });
}