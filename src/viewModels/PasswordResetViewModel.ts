import { IsEmail, Length, IsBase64, IsAscii } from "class-validator";

export class PasswordResetViewModel {
    @IsEmail()
    email: string;

    @IsAscii()
    @Length(6, 72)
    password: string;

    @IsBase64()
    token: string;
}
