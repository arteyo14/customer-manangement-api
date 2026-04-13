import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginRequestDto } from './dto/login.dto';

@Injectable()
export class LoginService {
  private readonly logger = new Logger(LoginService.name);

  login(loginDto: LoginRequestDto) {
    try {
      const admin = {
        email: 'admin@example.com',
        password: 'P@ssw0rd!',
      };

      const isEmailMatch = loginDto.email === admin.email;
      const isPasswordMatch = loginDto.password === admin.password;

      if (!isEmailMatch || !isPasswordMatch) {
        throw new UnauthorizedException({
          message: 'Email or Password is not correct',
        });
      }

      this.logger.log(`Login successful`);
      return {};
    } catch (error) {
      this.logger.error('Error in login:', error);
      throw error;
    } finally {
      this.logger.log('login completed');
    }
  }
}
