import express, { NextFunction, Request, Response } from "express";
import { upload } from "../middlewares";
import { deleteImage, ErrorHandler, uploadImage } from "../utils";
import { bannerService } from "../services";
import { TImage } from "types";


const router = express.Router();

router.get("/", async(req: Request, res: Response, next: NextFunction) => {})

router.get("/:id", async(req: Request, res: Response, next: NextFunction) => {})



export { router as productRoutes }