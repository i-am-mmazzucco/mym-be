import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  ValidateIf,
  IsNotEmptyObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Product } from '../products/product.entity';

class ClientIdDto {
  @IsNumber()
  id: number;
}

class EmployeeAssignedIdDto {
  @IsNumber()
  id: number;
}

class BaserOrderDto {
  @IsString()
  address: string;

  @Type(() => Date)
  @IsOptional()
  dateDelivery?: Date;

  @IsIn(['pending', 'delivered', 'cancelled'])
  @IsOptional()
  statusDelivery: string;

  @IsIn(['cash', 'credit_card', 'debit_card'])
  @IsOptional()
  typePayment: string;

  @IsIn(['pending', 'paid', 'failed'])
  @IsOptional()
  statusPayment: string;

  @IsString()
  @IsOptional()
  invoiceNumber?: string;

  @IsNumber()
  @ValidateIf((o) => o.statusPayment === 'paid')
  totalAmountPaid?: number;
}

export class CreateItemDto {
  @IsNumber()
  quantity: number;

  @ValidateNested()
  @Type(() => Product)
  product: Product;
}

export class CreateOrderDto extends BaserOrderDto {
  @ValidateNested()
  @Type(() => ClientIdDto)
  @IsOptional()
  client: ClientIdDto;

  @ValidateNested()
  @Type(() => EmployeeAssignedIdDto)
  @IsOptional()
  employeeAssigned: EmployeeAssignedIdDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateItemDto)
  items: UpdateItemDto[];
}

class ProductIdDto {
  @IsNumber()
  id: number;
}

export class UpdateItemDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ProductIdDto)
  product: ProductIdDto;

  @IsNumber()
  quantity: number;
}

export class UpdateOrderDto extends BaserOrderDto {
  @IsNumber()
  @IsOptional()
  totalAmount?: number;

  @IsNumber()
  @IsOptional()
  routeId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateItemDto)
  items: UpdateItemDto[];
}

export class SearchOrderDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  clientId?: number | string;
}
