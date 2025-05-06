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
import { Users } from '../users/users.entity';

class BaserOrderDto {
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
}

export class CreateItemDto {
  @IsNumber()
  quantity: number;

  @ValidateNested()
  @Type(() => Product)
  product: Product;
}

export class CreateOrderDto extends BaserOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemDto)
  items: CreateItemDto[];
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
