import { MaxLength, IsEmail, MinLength, IsArray, IsAscii, IsLowercase, ArrayUnique} from 'class-validator';

export class RoleViewModel {

    @IsLowercase()
    @MaxLength(256)
    name: string;

    @MaxLength(256)
    description: string;

    @ArrayUnique()
    @IsArray()
    claims: string[]
}
