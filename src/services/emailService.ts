import * as nodemailer from "nodemailer";
import { EmailResetPasswordContentType } from "../infrastructure/customTypes";

export default class EmailService {

    static createTransport(){
       if(!process.env.SMTP_HOST)
           throw new Error('SMTP_HOST não pode ser vazio');
       if(!process.env.SMTP_PORT)
           throw new Error('SMTP_PORT não pode ser vazia');
        if(!process.env.SMTP_LOGIN_EMAIL)
           throw new Error('SMTP_LOGIN_EMAIL não pode ser vazio');
       if(!process.env.SMTP_LOGIN_PASSWORD)
           throw new Error('SMTP_LOGIN_PASSWORD não pode ser vazio');

        return nodemailer.createTransport({
            // @ts-ignore
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE == "true", // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_LOGIN_EMAIL,
                pass: process.env.SMTP_LOGIN_PASSWORD,
            },
        });
    }

    static async createFakeTransport(){
        let testAccount = await nodemailer.createTestAccount();
        return nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });
    }

    static async sendEmail(emailContent: EmailResetPasswordContentType) {
        const transport = process.env.SMTP_FAKE === "true" ? await this.createFakeTransport(): this.createTransport();
        return await transport.sendMail(emailContent);
    }
}