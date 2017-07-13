import { MaxLength, MinLength, IsAscii } from "class-validator";

export class PasswordViewModel {
    @MinLength(6)
    password: string;

    @IsAscii()
    @MinLength(6)
    @MaxLength(72)
    newPassword: string;
}
