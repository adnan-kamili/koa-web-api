import { IsEmail, Length, IsBase64, IsAscii } from "class-validator";
import { BaseViewModel } from "./BaseViewModel";

export class PasswordResetViewModel extends BaseViewModel {
    @IsEmail()
    email: string;

    @IsAscii()
    @Length(6, 72)
    password: string;

    @IsBase64()
    token: string;
}
