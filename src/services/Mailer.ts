import { Service } from "typedi";

@Service()
export class Mailer {
    async sendEmail(email: string, subject: string, message: string) {

    }
}
