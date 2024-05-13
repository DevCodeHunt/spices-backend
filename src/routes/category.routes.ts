import express, { NextFunction, Request, Response } from "express";
import { ErrorHandler, UploadedFile, uploadImage } from "../utils";
import { isAdmin, isAuthenticated, upload } from "../middlewares";
import { adminService } from "../services";

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send([])
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

router.post("/upload-image", upload.single("image"), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const image = await uploadImage(req.file as UploadedFile)
        res.status(200).send(image)
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

router.use(isAuthenticated, isAdmin)
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, image } = req.body
        if (!name) return next(new ErrorHandler(400, "Category name is required"));
        if (!image) return next(new ErrorHandler(400, "Category image is required"));

        const category = await adminService.addCategory(req.body)
        res.status(200).send(category)
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

router.put("/:id", upload.single("image"), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, image } = req.body
        if (!name) return next(new ErrorHandler(400, "Category name is required"));
        if (!image) return next(new ErrorHandler(400, "Category image is required"));

        const category = await adminService.addCategory(req.body)
        res.status(200).send(category)
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

router.delete("/:id", upload.single("image"), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, image } = req.body
        if (!name) return next(new ErrorHandler(400, "Category name is required"));
        if (!image) return next(new ErrorHandler(400, "Category image is required"));

        const category = await adminService.addCategory(req.body)
        res.status(200).send(category)
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

export { router as categoryRoutes }