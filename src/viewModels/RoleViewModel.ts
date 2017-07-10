import { MaxLength, IsEmail, MinLength, IsArray, IsAscii} from 'class-validator';

export class RoleViewModel {

    @MaxLength(256)
    name: string;

    @MaxLength(256)
    description: string;

    @IsArray()
    claims: Array<string>
}
