import { Logger, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import data from '../../mock_customer.json';
import { CustomerListRequestDto } from './dto/customer-request.dto';

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  getList(query: CustomerListRequestDto) {
    try {
      const { page, limit, search, sort, sort_by } = query;

      let result = [...data];

      if (search) {
        const searchLower = search.toLowerCase();
        result = result.filter(
          (customer) =>
            customer.name.toLowerCase().includes(searchLower) ||
            customer.company.toLowerCase().includes(searchLower) ||
            customer.email.toLowerCase().includes(searchLower) ||
            customer.phone.toLowerCase().includes(searchLower),
        );
      }

      if (sort && sort_by) {
        result.sort((a, b) => {
          const key = sort_by as keyof typeof a;
          const aValue = a[key];
          const bValue = b[key];

          if (aValue < bValue) return sort === 'asc' ? -1 : 1;
          if (aValue > bValue) return sort === 'asc' ? 1 : -1;
          return 0;
        });
      }

      const totalItems = result.length;
      const totalPages = Math.ceil(totalItems / limit);

      const skip = (page - 1) * limit;
      const paginatedData = result.slice(skip, skip + limit);

      return {
        total: totalItems,
        items: paginatedData,
        page,
        limit,
        total_pages: totalPages,
      };
    } catch (error) {
      this.logger.error('Error in getList:', error);
      throw error;
    } finally {
      this.logger.log('getList completed');
    }
  }

  getDetail(id: number) {
    try {
      const result = data.find((customer) => customer.id === id);
      if (!result) {
        this.logger.error(`Customer with ID ${id} not found`);
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }
      return result;
    } catch (error) {
      this.logger.error('Error in getDetail:', error);
      throw new NotFoundException({ message: 'Customer not found' });
    } finally {
      this.logger.log('getDetail completed');
    }
  }
}
