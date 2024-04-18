import express, { NextFunction, Request, Response } from "express";
import { upload } from "../middlewares";
import { deleteImage, ErrorHandler, uploadImage } from "../utils";
import { bannerService } from "../services";
import { TImage } from "types";


const router = express.Router();



export { router as eventRoutes }