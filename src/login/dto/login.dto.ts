import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Email is Required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is Required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
