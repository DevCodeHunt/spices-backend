import ejs from "ejs";
import path from "path";
import { sendMail } from "../utils";
import { NextFunction } from "express";


class MailService {
    async verifyMail(data: any, template: any, next: NextFunction) {
        const templatePath = path.join(__dirname, "../views", `${template}.ejs`);
        const html = await ejs.renderFile(templatePath, { ...data });
        const emailData = {
            email: data.email,
            subject: `Verification email`,
            html,
        };

        await sendMail(emailData, next);
    }
    async forgotPasswordMail(data: any, template: any, next: NextFunction) {
        const templatePath = path.join(__dirname, "../views", `${template}.ejs`);
        const html = await ejs.renderFile(templatePath, { ...data });
        const emailData = {
            email: data.email,
            subject: `Reset Password`,
            html,
        };

        await sendMail(emailData, next);
    }

    async orderConfirmedMail(data: any, template: any, next: NextFunction) {
        const templatePath = path.join(__dirname, "../views", `${template}.ejs`);
        const html = await ejs.renderFile(templatePath, { ...data });
        const emailData = {
            email: data.data.email,
            subject: `Order Confirmation`,
            html,
        };

        await sendMail(emailData, next);
    }
}

export const mailService = new MailService();