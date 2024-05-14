import express, { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../utils";
import { authService, mailService, userService } from "../services";
import { isAuthenticated } from "../middlewares";

const CLIENT_URL = process.env.CLIENT_URL
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
    }

    const user = await authService.signup(values)
    const token = authService.generateVerifyEmailToken(email)
    const href = `${CLIENT_URL}/verification-mail?token=${`${token}&email=${email}`}`;
    await mailService.forgotPasswordMail(
        { name: user.name, email, href },
        "verify-account",
        next
    );

    res.status(201).json(user)


})


router.post("/verify", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body;
        if (!token) {
            return next(new ErrorHandler(400, "Token is required."))
        }

        const payload = authService.verifyEmailToken(token)
        if (!payload) {
            return next(new ErrorHandler(400, "Invalid token."))
        }
        const user = await userService.findUserWithEmail(payload.email)
        if (!user) {
            return next(new ErrorHandler(400, "User not found."))
        }

        if (user.verified) {
            return next(new ErrorHandler(400, "Email is already verified."))
        }

        user.verified = true
        await user.save()

        res.status(200).json({
            message: "Email is verified."
        })
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})


router.post("/send-verification-mail", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body
        if (!email) {
            return next(new ErrorHandler(400, "Email is required."))
        }
        const user = await userService.findUserWithEmail(email)
        if (!user) {
            return next(new ErrorHandler(400, "User not found."))
        }
        if (user.verified) {
            return next(new ErrorHandler(400, "Email is already verified."))
        }
        const token = authService.generateVerifyEmailToken(email)
        const href = `${CLIENT_URL}/verification-mail?token=${`${token}&email=${email}`}`;
        await mailService.verifyMail(
            { name: user.name, email, href },
            "verify-account",
            next
        );
        res.status(200).json({
            message: "Verification mail sent."
        })
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})


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


router.post("/forgot-password", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body
        if (!email) {
            return next(new ErrorHandler(400, "Email is required."))
        }

        const user = await userService.findUserWithEmail(email);
        if (!user) {
            return next(new ErrorHandler(400, "User does not exit."))
        }

        const resetToken = authService.passwordResetToken(email)

        const href = `${CLIENT_URL}/reset-password?token=${`${resetToken}`}`;

        await mailService.forgotPasswordMail(
            { name: user.name, email, href },
            "forgot-password",
            next
        );
        res.status(200).json({
            message: `Reset password link has been sent to your email (${email}).`,
            token: resetToken,
        })
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})


router.patch("/reset-password", async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { newPassword, confirmPassword, token } = req.body;

        if (!token) {
            return next(new ErrorHandler(400, "Token is required."))
        }
        if (!newPassword) {
            return next(new ErrorHandler(400, "Password is required."))
        }
        if (!confirmPassword) {
            return next(new ErrorHandler(400, "Confirm password is required."))
        }
        if (newPassword !== confirmPassword) {
            return next(new ErrorHandler(400, "Password does not match."))
        }

        const verifyToken = authService.verifyPasswordResetToken(token);
        if (!verifyToken) {
            return next(new ErrorHandler(400, "Token expired."))
        }

        const { email } = verifyToken
        const user = await userService.findUserWithEmail(email);
        if (!user) {
            return next(new ErrorHandler(400, "User does not exit."))
        }
        user.password = newPassword
        await user.save()
        res.status(200).json({
            message: "Password has been reset successfully.",

        })

    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
})

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