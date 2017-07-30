import { IsEmail, IsNotEmpty } from "class-validator";
import { NormalizeEmail } from "class-sanitizer";
import { BaseViewModel } from "./BaseViewModel";

export class LoginViewModel extends BaseViewModel {

    @IsEmail()
    @NormalizeEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}
