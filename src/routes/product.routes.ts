import express, { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../utils";
import { productService } from "../services";


const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await productService.getProducts();
        res.status(200).send(products)
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
 })

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.status(200).send(product)
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})



export { router as productRoutes }