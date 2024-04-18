import express, { NextFunction, Request, Response } from "express";
import { upload } from "../middlewares";
import { deleteImage, ErrorHandler, uploadImage } from "../utils";
import { bannerService } from "../services";
import { TImage } from "types";


const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    const banners = await bannerService.getAllBanners();
    res.status(200).json(banners);
})

router.post("/", upload.single("image"), async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        const result = await uploadImage(req.file)
        const banner = await bannerService.createBanner({
            title: req.body.title,
            description: req.body.description,
            link: req.body.link,
            image: result as TImage
        })

        res.json(banner)
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

router.put("/:id", upload.single("image"), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id


        let image;

        if (req.file) {
            await deleteImage(req.body.imageId)
            image = await uploadImage(req.file)
        } else if (req.body.image) {
            image = JSON.parse(req.body.image)
        } else {
            return next(new ErrorHandler(400, "No image data provided."))
        }


        const banner = await bannerService.editBanner(id, {
            title: req.body.title,
            description: req.body.description,
            link: req.body.link,
            image,
            imageId: req.body.imageId
        })


        res.json(banner)
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const findBanner = await bannerService.getBanner(req.params.id)
        if(!findBanner){
            return next(new ErrorHandler(404, "Banner not found."))
        }

        await deleteImage(findBanner?.image.id)
        const banner = await bannerService.deleteBanner(req.params.id)
        res.json(banner)
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

export { router as bannerRoutes }