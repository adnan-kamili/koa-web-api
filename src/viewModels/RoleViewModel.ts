import { MaxLength, IsArray, ArrayUnique, IsNotEmpty } from "class-validator";
import { BaseViewModel } from "./BaseViewModel";

export class RoleViewModel extends BaseViewModel {

    @IsNotEmpty()
    @MaxLength(256)
    name: string;

    @MaxLength(256)
    description: string;

    @IsArray()
    @ArrayUnique()
    claims: string[];
}
