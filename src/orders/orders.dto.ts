import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Product } from '../products/product.entity';
import { PartialType } from '@nestjs/mapped-types';
import { Users } from '../users/users.entity';

export class CreateItemDto {
  @IsNumber()
  quantity: number;

  @ValidateNested()
  @Type(() => Product)
  product: Product;
}

export class CreateOrderDto {
  @ValidateNested()
  @Type(() => Users)
  client: Users;

  @ValidateNested()
  @Type(() => Users)
  employeeAssigned: Users;

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemDto)
  items: CreateItemDto[];
}

export class UpdateItemDto extends PartialType(CreateItemDto) {}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsNumber()
  @IsOptional()
  totalAmount?: number;

  @IsNumber()
  @IsOptional()
  routeId?: number;
}

export class SearchOrderDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  clientId?: number | string;
}
