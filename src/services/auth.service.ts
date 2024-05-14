import { User } from "../models/user.model";
import { AuthPayload, SignInInput, SignUpInput, TokenPair } from "../types";
import { userService } from "./user.service";
import jwt, { JwtPayload } from "jsonwebtoken"
import bcrypt from "bcrypt"
import crypto from "crypto"

class AuthService {
    async signup(values: SignUpInput): Promise<any> {
        const username = await userService.createUserName(values.email)
        const data = {
            ...values,
            username
        }
        return await User.create(data)
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10)
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash)
    }

    generateSignature(payload: AuthPayload): TokenPair {
        const access_token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
            expiresIn: process.env.JWT_ACCESS_TIME
        })

        const refresh_token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
            expiresIn: process.env.JWT_REFRESH_TIME
        })

        return {
            access_token,
            refresh_token
        }
    }



    async verifyRefreshToken(token: string) {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as JwtPayload;
    }

    generateVerifyEmailToken(email: string) {
        return jwt.sign({ email }, process.env.VERIFICATION_MAIL_SECRET as string, {
            expiresIn: "15m"
        })
    }
    verifyEmailToken(token: string) {
        return jwt.verify(token, process.env.VERIFICATION_MAIL_SECRET as string) as JwtPayload;
    }

    passwordResetToken(email: string) {
        return jwt.sign({ email }, process.env.PASSWORD_RESET_SECRET as string, {
            expiresIn: "15m"
        })


    }

    verifyPasswordResetToken(token: string) {
        return jwt.verify(token, process.env.PASSWORD_RESET_SECRET as string) as JwtPayload
    }
};

export const authService = new AuthService();