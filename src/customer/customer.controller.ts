import { BadRequestException, Controller, Get, HttpCode, HttpStatus, Logger, Param, Post, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerListRequestDto } from './dto/customer-request.dto';

@Controller('customer')
export class CustomerController {
    private readonly logger = new Logger(CustomerController.name);
    constructor(private readonly customerService: CustomerService) { }
    @Get()
    async getList(@Query() query: CustomerListRequestDto) {
        return await this.customerService.getList(query);
    }

    @Get(':id')
    async getDetail(@Param('id') id: string) {
        const customerId = Number(id);
        if (isNaN(customerId)) {
            throw new BadRequestException('ID must be a number');
        }
        return await this.customerService.getDetail(customerId);
    }
}
