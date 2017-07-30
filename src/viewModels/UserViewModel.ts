import { MaxLength, IsEmail, Length, IsArray, IsAscii, ArrayUnique, ArrayMaxSize, IsNotEmpty } from "class-validator";
import { NormalizeEmail } from "class-sanitizer";
import { BaseViewModel } from "./BaseViewModel";

export class UserViewModel extends BaseViewModel {

    @IsNotEmpty()
    @MaxLength(256)
    name: string;

    @IsEmail()
    @NormalizeEmail()
    email: string;

    @IsAscii()
    @Length(6, 72)
    password: string;

    @IsArray()
    @ArrayUnique()
    @ArrayMaxSize(10)
    roles: string[];
}
