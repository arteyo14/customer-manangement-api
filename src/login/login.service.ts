import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginRequestDto } from './dto/login.dto';

@Injectable()
export class LoginService {
    async login(loginDto: LoginRequestDto) {
        const admin = {
            email: "admin@example.com",
            password: "P@ssw0rd!"
        }

        const isEmailMatch = loginDto.email === admin.email;
        const isPasswordMatch = loginDto.password === admin.password;

        if (!isEmailMatch || !isPasswordMatch) {
            throw new UnauthorizedException({ message: "Email or Password is not correct" });
        }


        return {}
    }
}
