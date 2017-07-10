import { MaxLength, IsEmail, MinLength, IsArray, IsAscii} from 'class-validator';

export class EmailViewModel {

    @IsEmail()
    email: string;
}
