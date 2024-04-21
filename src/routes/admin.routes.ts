import express, { NextFunction, Request, Response } from "express";
import { upload } from "../middlewares";
import { deleteImage, ErrorHandler, UploadedFile, uploadImage, uploadImages } from "../utils";
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

router.post("/products/upload-product-image", upload.array("images"), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const images = await uploadImages(req.files as UploadedFile[])
        res.status(200).json(images)
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

router.post("/products/replace-product-image", upload.single("image"), async (req: Request, res: Response, next: NextFunction) => {
    try {
        await deleteImage(req.body.imageId)
        const image = await uploadImage(req.file as UploadedFile)
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





export { router as adminRoutes }