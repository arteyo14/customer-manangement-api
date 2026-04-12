import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginRequestDto } from './dto/login.dto';

@Controller('login')
export class LoginController {
    constructor(private readonly loginService: LoginService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    async login(@Body() request: LoginRequestDto) {
        return await this.loginService.login(request)
    }
}
