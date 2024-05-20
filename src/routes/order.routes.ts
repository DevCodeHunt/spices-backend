import express, { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../utils";
import { isAuthenticated } from "../middlewares";
import { mailService } from "../services";

const router = express.Router();

router.post("/create",isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if(!user) {
            return next(new ErrorHandler(401, "Unauthorized please login to order confirmation"))
        }

        const { products, shippingAddress, data } = req.body

        await mailService.orderConfirmedMail({...req.body, trackOrder: "hgsg" }, "order-confirmed", next)
        

        res.status(200).json("Ordered")
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message));
    }
})

export { router as orderRoutes }