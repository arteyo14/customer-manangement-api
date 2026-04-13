import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginController } from './login/login.controller';
import { LoginModule } from './login/login.module';
import { LoginService } from './login/login.service';
import { CustomerModule } from './customer/customer.module';
import { CustomerService } from './customer/customer.service';

@Module({
  imports: [LoginModule, CustomerModule],
  controllers: [AppController, LoginController],
  providers: [AppService, LoginService, CustomerService],
})
export class AppModule {}
