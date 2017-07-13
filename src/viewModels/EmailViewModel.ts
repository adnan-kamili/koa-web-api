import { IsEmail } from "class-validator";

export class EmailViewModel {

    @IsEmail()
    email: string;
}
