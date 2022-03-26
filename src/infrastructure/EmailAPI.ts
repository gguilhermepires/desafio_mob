import EmailService from "../services/emailService";
import { EmailResetPasswordContentType } from "./customTypes";

export default class EmailAPI {

    static async sendEmailResetPassword(to: string, resetLink: string): Promise<any> {
        let from = process.env.SMTP_EMAILSENDER;
        if(!from)
            throw new Error('Não é possível enviar um e-mail com o campo from vazio');

        let emailContent: EmailResetPasswordContentType = {
            from, // sender address
            to, // list of receivers
            subject: "Recuperação de senha", // Subject line
            text: `Acesse o link para resetar a senha: ${resetLink}`, // plain text body
            html: `<b>Acesse o link para resetar a senha: <a href="${resetLink}" >${resetLink}</a></b>`, // html body
        };

        return await EmailService.sendEmail(emailContent);
     }
}


