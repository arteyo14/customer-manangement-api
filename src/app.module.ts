import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginController } from './login/login.controller';
import { LoginModule } from './login/login.module';
import { LoginService } from './login/login.service';

@Module({
  imports: [LoginModule],
  controllers: [AppController, LoginController],
  providers: [AppService, LoginService],
})
export class AppModule { }
