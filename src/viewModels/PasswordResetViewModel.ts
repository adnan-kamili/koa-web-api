import { IsEmail, Length, IsBase64, IsAscii } from "class-validator";
import { NormalizeEmail } from "class-sanitizer";
import { BaseViewModel } from "./BaseViewModel";

export class PasswordResetViewModel extends BaseViewModel {

    @IsEmail()
    @NormalizeEmail()
    email: string;

    @IsAscii()
    @Length(6, 72)
    password: string;

    @IsBase64()
    token: string;
}
