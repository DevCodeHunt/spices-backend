import express, { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../utils";
import Stripe from 'stripe';
import dotenv from "dotenv"
import { paymentService } from "../services";
dotenv.config()


const router = express.Router();


router.post("/checkout", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { paymentMethod, products } = req.body


        const items = products.map((item: any) => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.product.name,
                    images: [item.product.images[0].url]
                },
                unit_amount: Math.round((paymentService.calculateDiscountedPrice(item.product.price, item.product.discountPrice)) * 100),
            },
            quantity: item.quantity,
        }))

        if (paymentMethod === "Card") {
            const session = await paymentService.makeStripePayment(items)
            return res.status(200).send(session)

        }



    } catch (error: any) {
        return next(new ErrorHandler(500, error.message));
    }
})

export { router as paymentRoutes }