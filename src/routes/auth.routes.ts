import express, { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../utils";
import { authService, userService } from "../services";
import { isAuthenticated } from "../middlewares";


const router = express.Router();

router.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
    const {
        name,
        email,
        password,
        confirmPassword,
        acceptTerms,
        subscribed
    } = req.body
    if (!name) {
        return next(new ErrorHandler(400, "Name is required."))
    }
    if (!email) {
        return next(new ErrorHandler(400, "Email is required."))
    }
    if (!password) {
        return next(new ErrorHandler(400, "Password is required."))
    }
    if (!confirmPassword) {
        return next(new ErrorHandler(400, "Confirm password is required."))
    }

    // Check if the user is alredy exist
    const existUser = await userService.findUserWithEmail(email);
    if (existUser) {
        if (existUser.verified) {
            return next(new ErrorHandler(400, "Email is already exist."))
        } else {
            return next(
                new ErrorHandler(400, "Email is already registered but not verified")
            );
        }
    }

    const values = {
        name,
        email,
        password,
        confirmPassword,
        acceptTerms: Boolean(acceptTerms),
        subscribed: Boolean(subscribed),
        verified: true,
    }

    const user = await authService.signup(values)

    res.status(201).json(user)


})


router.post("/verify", async (req: Request, res: Response, next: NextFunction) => { })


router.post("/send-verification-mail", async (req: Request, res: Response, next: NextFunction) => { })


router.post("/signin", async (req: Request, res: Response, next: NextFunction) => {
    const {
        email,
        password
    } = req.body
    if (!email) {
        return next(new ErrorHandler(400, "Email is required."))
    }
    if (!password) {
        return next(new ErrorHandler(400, "Password is required."))
    }

    const user = await userService.findUserWithEmail(email)
    if (!user) {
        return next(new ErrorHandler(400, "Email is incorrect."))
    }

    if (!user.verified) {
        return next(new ErrorHandler(400, "Email is not verified."))
    }

    const validPassword = await authService.comparePassword(password, user.password)

    if (!validPassword) {
        return next(new ErrorHandler(400, "Password is incorrect."))
    }

    const { access_token, refresh_token } = authService.generateSignature({
        id: user.id,
        email: user.email,
        role: user.roles
    })

    res.cookie('spicesRefreshToken', refresh_token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
    res.status(200).json({
        access_token,
        refresh_token
    })


})


router.post("/forgot-password", async (req: Request, res: Response, next: NextFunction) => { })


router.post("/reset-password", async (req: Request, res: Response, next: NextFunction) => { })

router.get("/refresh-token", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookies = req.cookies;
        if (!cookies.spicesRefreshToken)
            return next(new ErrorHandler(401, "Unauthorized"));

        const refreshToken = cookies.spicesRefreshToken;

        const decoded = await authService.verifyRefreshToken(refreshToken);

        const user = await userService.findUserWithId(decoded.id);
        if (!user) {
            return next(new ErrorHandler(401, "Unauthorized"));
        }

        const { access_token, refresh_token } = authService.generateSignature({
            id: user.id,
            email: user.email,
            role: user.roles
        })

        res.cookie('spicesRefreshToken', refresh_token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
        res.status(200).json({
            access_token,
            user
        })



    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})


router.post("/logout", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookies = req.cookies;
        if (!cookies.spicesRefreshToken)
            return next(new ErrorHandler(204, "No content"));

        res.clearCookie("spicesRefreshToken", {
            httpOnly: true,
        });
        res.status(200).json({ message: "Logout successfully done." });
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

export { router as authRoutes }