import { IsEmail, IsNotEmpty } from "class-validator";
import { BaseViewModel } from "./BaseViewModel";

export class LoginViewModel extends BaseViewModel {

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}
