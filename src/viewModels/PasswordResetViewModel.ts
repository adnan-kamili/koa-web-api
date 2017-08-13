import { IsEmail, Length, IsAscii, IsNotEmpty } from "class-validator";
import { NormalizeEmail } from "class-sanitizer";
import { BaseViewModel } from "./BaseViewModel";

export class PasswordResetViewModel extends BaseViewModel {

    @IsEmail()
    @NormalizeEmail()
    email: string;

    @IsAscii()
    @Length(6, 72)
    password: string;

    @IsNotEmpty()
    @IsAscii()
    token: string;
}
