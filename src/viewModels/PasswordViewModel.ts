import { MaxLength, MinLength, IsAscii } from "class-validator";
import { BaseViewModel } from "./BaseViewModel";

export class PasswordViewModel extends BaseViewModel {
    @MinLength(6)
    password: string;

    @IsAscii()
    @MinLength(6)
    @MaxLength(72)
    newPassword: string;
}
