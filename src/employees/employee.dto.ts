import { RouteWithoutEmployeeDto } from '../routes/routes.dto';
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ClientDto, ClientUpdateDto } from '../clients/clients.dto';

export class EmployeeDto extends ClientDto {
  @Type(() => RouteWithoutEmployeeDto)
  @IsOptional()
  routes: RouteWithoutEmployeeDto[];
}

class OrderDto {
  @IsNumber()
  id: number;
}

export class EmployeeUpdateDto extends ClientUpdateDto {
  @ValidateNested({ each: true })
  @Type(() => RouteWithoutEmployeeDto)
  routes: RouteWithoutEmployeeDto[];

  @ValidateNested()
  @Type(() => OrderDto)
  order: OrderDto;
}

export class SearchEmployeeDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsBoolean()
  withoutRoutes?: boolean;
}
