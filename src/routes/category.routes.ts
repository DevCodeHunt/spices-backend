import express, { NextFunction, Request, Response } from "express";
import { deleteImage, ErrorHandler, UploadedFile, uploadImage } from "../utils";
import { isAdmin, isAuthenticated, upload } from "../middlewares";
import { adminService } from "../services";
import { Category } from "../models";

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await Category.find()
        res.status(200).send(categories)
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

router.post("/upload-image", upload.single("image"), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { imageId } = req.body;
        let image
        if (imageId) {
            await deleteImage(imageId)
            image = await uploadImage(req.file as UploadedFile)
        } else {
            image = await uploadImage(req.file as UploadedFile)
        }
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

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, image } = req.body
        if (!name) return next(new ErrorHandler(400, "Category name is required"));
        if (!image) return next(new ErrorHandler(400, "Category image is required"));

        const category = await adminService.updateCategory({
            name,
            image,
            id: req.params.id,
        })
        res.status(200).send(category)
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { imageId } = req.query
        await deleteImage(imageId as string)

        const category = await adminService.deleteCategory(req.params.id)
        res.status(200).send(category)
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

router.post("/deleteAllCategory", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { categories} = req.body
        await adminService.deleteAllCategory(categories)
        await Promise.all(categories.map(async (category: any) => {
            await deleteImage(category.image.id)
        }))
        res.status(200).send(categories)
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

export { router as categoryRoutes }