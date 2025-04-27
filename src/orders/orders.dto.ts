import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
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

  @IsDate()
  @Type(() => Date)
  dateDelivery: Date;

  @IsString()
  statusDelivery: string;

  @IsString()
  typePayment: string;

  @IsString()
  statusPayment: string;

  @IsString()
  @IsOptional()
  invoiceNumber?: string;

  @IsNumber()
  totalAmount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemDto)
  items: CreateItemDto[];
}

export class UpdateItemDto extends PartialType(CreateItemDto) {}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
