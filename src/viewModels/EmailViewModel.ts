import { IsEmail } from "class-validator";
import { NormalizeEmail } from "class-sanitizer";

import { BaseViewModel } from "./BaseViewModel";

export class EmailViewModel extends BaseViewModel {

    @IsEmail()
    @NormalizeEmail()
    email: string;
}
