import { MaxLength, IsEmail, Length, IsArray, IsAscii, IsNotEmpty } from "class-validator";
import {IsStrict} from "../validators/IsStrict";

//@IsStrict("1", {})
export class RegisterViewModel {

    @IsNotEmpty()
    @MaxLength(256)
    name: string;

    @IsEmail()
    email: string;

    @IsAscii()
    @Length(6, 72)
    password: string;

    @IsNotEmpty()
    @MaxLength(256)
    company: string;
}
