import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterLoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
