import express, { NextFunction, Request, Response } from "express";
import { upload } from "../middlewares";
import { deleteImage, ErrorHandler, uploadImage } from "../utils";
import { bannerService } from "../services";
import { TImage } from "types";


const router = express.Router();

router.get("/products", async (req: Request, res: Response, next: NextFunction) => { })

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => { })

router.get("/orders", async (req: Request, res: Response, next: NextFunction) => { })

router.get("/users", async (req: Request, res: Response, next: NextFunction) => { })

router.get("/coupuns", async (req: Request, res: Response, next: NextFunction) => { })

router.get("/notifications", async (req: Request, res: Response, next: NextFunction) => { })

router.get("/blogs", async (req: Request, res: Response, next: NextFunction) => { })

router.get("/events", async (req: Request, res: Response, next: NextFunction) => { });

router.get("/stores", async (req: Request, res: Response, next: NextFunction) => { });


router.get("/categories", async (req: Request, res: Response, next: NextFunction) => { })





export { router as adminRoutes }