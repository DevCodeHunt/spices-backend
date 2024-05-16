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


router.post("/carts/add", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if (!user) {
            return next(new ErrorHandler(404, "Unauthorized please login to add to wishlist"))
        }

        const findUser = await userService.findUserWithId(user.id)
        if (!findUser) {
            return next(new ErrorHandler(404, "User not found"))
        }

        const { productId, quantity } = req.body

        const product = await productService.getProductById(productId);
        if (!product) {
            return next(new ErrorHandler(404, "Product not found"))
        }
        const existingCartItem = findUser.carts.find(item => item.product.toString() === productId);

        if (existingCartItem) {
            existingCartItem.quantity = quantity
        } else {
            findUser.carts.push({
                product: productId,
                quantity: quantity
            })
        }

        await findUser.save()


        res.status(200).json({
            message: `${quantity} item added to cart`,
            cart: findUser.carts
        })
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

router.post("/carts/remove", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
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

        const product = await productService.getProductById(productId);
        if (!product) {
            return next(new ErrorHandler(404, "Product not found"))
        }
        const existingCartItemIndex = findUser.carts.findIndex((item: any) => item.product._id.toString() === productId);

    
        if (existingCartItemIndex !== -1) {
            findUser.carts.splice(existingCartItemIndex, 1);
        }

        await findUser.save()
        res.status(200).json({
            message: "Item removed from cart",
            cart: findUser.carts
        })
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

router.post("/carts/increment", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
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

        const product = await productService.getProductById(productId);
        if (!product) {
            return next(new ErrorHandler(404, "Product not found"))
        }
        const existingCartItem = findUser.carts.find((item: any) => item.product._id.toString() === productId);

        if (existingCartItem) {
            if (existingCartItem.quantity + 1 > product.stock) {
                return next(new ErrorHandler(400, "You have reached the limit. Not enough stock"));
            }
            existingCartItem.quantity += 1
        }

        await findUser.save()
        res.status(200).json(findUser.carts)
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

router.post("/carts/decrement", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
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

        const product = await productService.getProductById(productId);
        if (!product) {
            return next(new ErrorHandler(404, "Product not found"))
        }
        const existingCartItemIndex = findUser.carts.findIndex((item: any) => item.product._id.toString() === productId);

        if (existingCartItemIndex !== -1) {
            const existingCartItem = findUser.carts[existingCartItemIndex];
            if (existingCartItem.quantity > 1) {
                existingCartItem.quantity -= 1;
            } else {
                findUser.carts.splice(existingCartItemIndex, 1);
            }
        }

        await findUser.save()
        res.status(200).json(findUser.carts)
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

router.post("/carts/removeAll", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if (!user) {
            return next(new ErrorHandler(404, "Unauthorized please login to add to wishlist"))
        }

        const findUser = await userService.findUserWithId(user.id)
        if (!findUser) {
            return next(new ErrorHandler(404, "User not found"))
        }
        findUser.carts = [] as any
        await findUser.save()
        res.status(200).json({
            user: findUser,
            message: "All items removed from cart"
        })


    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

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
            message: "All product removed from wishlist",
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