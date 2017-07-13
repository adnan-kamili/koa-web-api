import { MaxLength, IsArray, ArrayUnique, IsNotEmpty } from "class-validator";

export class RoleViewModel {

    @IsNotEmpty()
    @MaxLength(256)
    name: string;

    @MaxLength(256)
    description: string;

    @ArrayUnique()
    @IsArray()
    claims: string[];
}
