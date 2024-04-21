import express, { NextFunction, Request, Response } from "express";
import { isAuthenticated } from "../middlewares";
import { userService } from "../services";
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

router.post("/wishlists", async (req: Request, res: Response, next: NextFunction) => { })

router.post("/orders/create", async (req: Request, res: Response, next: NextFunction) => { })

router.post("/orders/cancel", async (req: Request, res: Response, next: NextFunction) => { })

router.post("/orders/replace", async (req: Request, res: Response, next: NextFunction) => { });

router.post("/compares", async (req: Request, res: Response, next: NextFunction) => { })


export { router as userRoutes }