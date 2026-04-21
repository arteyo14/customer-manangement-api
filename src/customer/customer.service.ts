import { Logger, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import data from '../../mock_customer.json';
import { CustomerListRequestDto } from './dto/customer-request.dto';
import { CreditStatus, CustomerDetailResponseDto, CustomerListResponseDto, CustomerStatus } from './dto/customer-response.dto';

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  getList(query: CustomerListRequestDto): CustomerListResponseDto {
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

      //   if (sort && sort_by) {
      //     result.sort((a, b) => {
      //       const key = sort_by as keyof typeof a;
      //       const aValue = a[key];
      //       const bValue = b[key];
      //       if (aValue < bValue) return sort === 'asc' ? -1 : 1;
      //       if (aValue > bValue) return sort === 'asc' ? 1 : -1;
      //       return 0;
      //     });
      //   }

      const totalItems = result.length;
      const totalPages = Math.ceil(totalItems / limit);

      const skip = (page - 1) * limit;
      const paginatedData = result.slice(skip, skip + limit);

      if (sort && sort_by) {
        paginatedData.sort((a, b) => {
          const key = sort_by as keyof typeof a;
          const aValue = a[key];
          const bValue = b[key];

          if (aValue < bValue) return sort === 'asc' ? -1 : 1;
          if (aValue > bValue) return sort === 'asc' ? 1 : -1;
          return 0;
        });
      }

      return {
        total: totalItems,
        items: paginatedData.map(item => ({
          id: item.id,
          name: item.name,
          company: item.company,
          initials: item.initials,
          active_since: item.active_since,
          email: item.email,
          phone: item.phone,
          salesperson: item.salesperson,
          credit_status: item.credit_status as CreditStatus,
          status: item.status as CustomerStatus,
          total_spend: item.total_spend,
          number_of_purchases: item.number_of_purchases,
          last_activity: item.last_activity,
          recent_activity: item.recent_activity,
        })),
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

  getDetail(id: number): CustomerDetailResponseDto {
    try {
      const result = data.find((customer) => customer.id === id);
      if (!result) {
        this.logger.error(`Customer with ID ${id} not found`);
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }

      return {
        id: result.id,
        name: result.name,
        company: result.company,
        initials: result.initials,
        active_since: result.active_since,
        email: result.email,
        phone: result.phone,
        salesperson: result.salesperson,
        credit_status: result.credit_status as CreditStatus,
        status: result.status as CustomerStatus,
        total_spend: result.total_spend,
        number_of_purchases: result.number_of_purchases,
        last_activity: result.last_activity,
        recent_activity: result.recent_activity,
      };
    } catch (error) {
      this.logger.error('Error in getDetail:', error);
      throw new NotFoundException({ message: 'Customer not found' });
    } finally {
      this.logger.log('getDetail completed');
    }
  }
}
