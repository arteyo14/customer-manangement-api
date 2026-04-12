import { IsOptional, IsString } from "class-validator";
import { PaginationQueryDto } from "src/common/dto/pagination.dto";


export class CustomerListRequestDto extends PaginationQueryDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    sort?: string;

    @IsOptional()
    @IsString()
    sort_by?: string;
}