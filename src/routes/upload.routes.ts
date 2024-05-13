import express, { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../utils";

const router=  express.Router();

export { router as uploadRoutes }