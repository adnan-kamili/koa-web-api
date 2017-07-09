import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginViewModel {

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}
