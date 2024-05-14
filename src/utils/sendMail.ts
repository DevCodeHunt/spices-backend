import { NextFunction } from "express"
import nodemailer from "nodemailer"
import { ErrorHandler } from "./errorHandler"

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT
const SMTP_MAIL = process.env.SMTP_MAIL
const SMTP_PASSWORD = process.env.SMTP_PASSWORD
const SMPT_SERVICE = process.env.SMPT_SERVICE


export interface EmailData {
    subject: string;
    email: string;
    html: any;
    attachements?: any[]
}

export const sendMail = async (data: EmailData, next: NextFunction) => {
    const { subject, email, html, attachements } = data;
    try {
        const transportConfig = {
            host: SMTP_HOST,
            port: Number(SMTP_PORT),
            secure: true,
            service: SMPT_SERVICE,
            auth: {
                user: SMTP_MAIL,
                pass: SMTP_PASSWORD,
            },
        };

        const transporter = nodemailer.createTransport(transportConfig);

        const mailOptions = {
            from: SMTP_MAIL,
            to: email,
            subject,
            html,
            attachements: attachements && attachements.length > 0 && attachements
        };

        await transporter.sendMail(mailOptions);
    } catch (error: any) {
        return next(new ErrorHandler(500, error.message))
    }
}