import express, { NextFunction, Request, Response } from "express";
import { isAdmin, isAuthenticated, upload } from "../middlewares";
import { deleteImage, ErrorHandler, UploadedFile, uploadImage, uploadImages } from "../utils";
import { adminService, bannerService } from "../services";
import { TImage } from "types";


const router = express.Router();

router.get("/products", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await adminService.getProducts()
        res.status(200).json(products)
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})


router.post("/products/upload-product-image", upload.array("images"), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const images = await uploadImages(req.files as UploadedFile[], 800, 800)
        res.status(200).json(images)
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

router.post("/products/replace-product-image", upload.single("image"), async (req: Request, res: Response, next: NextFunction) => {
    try {
        await deleteImage(req.body.imageId)
        const image = await uploadImage(req.file as UploadedFile, 800, 800)
        res.status(200).json(image)
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

router.post("/products/delete-product-image", upload.array("images"), async (req: Request, res: Response, next: NextFunction) => {
    try {
        await deleteImage(req.body.imageId)
        res.status(200).json({
            message: "Images deleted successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

// router.use(isAuthenticated, isAdmin)
router.post("/products", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await adminService.createProduct(req.body)
        res.status(201).json(product)
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

router.put("/products/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = req.params.id
        const product = await adminService.updateProduct(productId, req.body)
        res.status(200).json(product)
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

router.post("/products/delete", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await adminService.deleteProduct(req.body.id)
        res.status(200).json(product)
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

router.post("/products/deleteAll", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await adminService.deleteAllProducts(req.body.products)
        res.status(200).json(product)
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})







export { router as adminRoutes }