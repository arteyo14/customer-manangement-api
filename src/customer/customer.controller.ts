import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerListRequestDto } from './dto/customer-request.dto';

@Controller('customer')
export class CustomerController {
  private readonly logger = new Logger(CustomerController.name);
  constructor(private readonly customerService: CustomerService) {}
  @Get()
  getList(@Query() query: CustomerListRequestDto) {
    return this.customerService.getList(query);
  }

  @Get(':id')
  getDetail(@Param('id') id: string) {
    const customerId = Number(id);
    if (isNaN(customerId)) {
      throw new BadRequestException('ID must be a number');
    }
    return this.customerService.getDetail(customerId);
  }
}
