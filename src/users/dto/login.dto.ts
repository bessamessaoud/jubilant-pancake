import { IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";

export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    @Matches(/[A-Z]/, {message : 'password must have at least one uppercase letter'})
    @Matches(/[0-9]/, {message : 'password must have at least a number'})
    @Matches(/[^A-Za-z0-9]/, {message : 'password must have at least one special character'})
    password: string;
}