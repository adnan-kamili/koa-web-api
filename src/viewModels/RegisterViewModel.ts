import { MaxLength, IsEmail, Length, IsAscii, IsNotEmpty } from "class-validator";
import { NormalizeEmail } from "class-sanitizer";
import { BaseViewModel } from "./BaseViewModel";

export class RegisterViewModel extends BaseViewModel {

    @IsNotEmpty()
    @MaxLength(256)
    name: string;

    @IsEmail()
    @NormalizeEmail()
    email: string;

    @IsAscii()
    @Length(6, 72)
    password: string;

    @IsNotEmpty()
    @MaxLength(256)
    company: string;
}
