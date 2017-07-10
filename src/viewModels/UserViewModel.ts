import { MaxLength, IsEmail, Length, IsArray, IsAscii, ArrayUnique, ArrayMaxSize} from 'class-validator';

export class UserViewModel {

    @MaxLength(256)
    name: string;

    @IsEmail()
    email: string;

    @IsAscii()
    @Length(6,72)
    password: string;

    @ArrayUnique()
    @ArrayMaxSize(10)
    @IsArray()
    roles: string[]
}
