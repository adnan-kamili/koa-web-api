import { IsEmail } from "class-validator";
import { BaseViewModel } from "./BaseViewModel";

export class EmailViewModel extends BaseViewModel {

    @IsEmail()
    email: string;
}
