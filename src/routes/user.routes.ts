import express, { NextFunction, Request, Response } from "express";
import { isAuthenticated } from "../middlewares";
import { productService, userService } from "../services";
import { ErrorHandler } from "../utils";

const router = express.Router();

router.get("/profile", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user) {
            const user = await userService.findUserWithId(req.user.id);
            res.status(200).json(user);
        } else {
            return next(new ErrorHandler(404, "Unauthorized please login to access"));
        }

    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

router.get("/addresses", async (req: Request, res: Response, next: NextFunction) => { })

router.get("/wishlists", async (req: Request, res: Response, next: NextFunction) => { })

router.get("/compares", async (req: Request, res: Response, next: NextFunction) => { })

router.get("/orders", async (req: Request, res: Response, next: NextFunction) => { })

router.patch("/addresses/:id", async (req: Request, res: Response, next: NextFunction) => { })

router.put("/profile", async (req: Request, res: Response, next: NextFunction) => { })


router.patch("/profile-pic", async (req: Request, res: Response, next: NextFunction) => { })

router.patch("/update-password", async (req: Request, res: Response, next: NextFunction) => { })


router.post("/addresses", async (req: Request, res: Response, next: NextFunction) => { })

router.patch("/addresses/:id", async (req: Request, res: Response, next: NextFunction) => { })

router.delete("/addresses:/id", async (req: Request, res: Response, next: NextFunction) => { })


router.post("/cart/add", async (req: Request, res: Response, next: NextFunction) => { })

router.post("/cart/remove", async (req: Request, res: Response, next: NextFunction) => { })

router.post("/cart/increment", async (req: Request, res: Response, next: NextFunction) => { })

router.post("/cart/decrement", async (req: Request, res: Response, next: NextFunction) => { })

router.post("/cart/remove/all", async (req: Request, res: Response, next: NextFunction) => { })

router.post("/wishlists", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if (!user) {
            return next(new ErrorHandler(404, "Unauthorized please login to add to wishlist"))
        }

        const findUser = await userService.findUserWithId(user.id)
        if (!findUser) {
            return next(new ErrorHandler(404, "User not found"))
        }

        const { productId } = req.body


        const product = await productService.getProductById(productId)
        if (!product) {
            return next(new ErrorHandler(404, "Product not found"))
        }

        const alreadyAdded = findUser.wishlists.find(wishlist => wishlist.id === productId);

        if (alreadyAdded) {
            const data = await userService.removeFromWishlist(user?.id, productId);
            return res.status(200).json({
                user: data,
                message: "Removed from wishlist",
            })
        } else {
            const data = await userService.addToWishlist(user?.id, productId);
            return res.status(200).json({
                user: data,
                message: "Added to wishlist",
            })
        }



    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

router.post("/wishlists/removeAll", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if (!user) {
            return next(new ErrorHandler(404, "Unauthorized please login to add to wishlist"))
        }

        const findUser = await userService.findUserWithId(user.id)
        if (!findUser) {
            return next(new ErrorHandler(404, "User not found"))
        }
        findUser.wishlists = [] as any
        await findUser.save()
        res.status(200).json({
            user: findUser,
            message: "Removed from wishlist",
        })


    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

router.post("/orders/create", async (req: Request, res: Response, next: NextFunction) => { })

router.post("/orders/cancel", async (req: Request, res: Response, next: NextFunction) => { })

router.post("/orders/replace", async (req: Request, res: Response, next: NextFunction) => { });

router.post("/compares", async (req: Request, res: Response, next: NextFunction) => { })


export { router as userRoutes }