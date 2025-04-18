import {
  IsString,
  ValidateNested,
  IsNumber,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LotDto } from '../lot/lot.dto';

export class CreateProductBodyDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsDate()
  @IsOptional()
  manufactureDate?: Date;

  @IsDate()
  @IsOptional()
  expirationDate?: Date;

  @ValidateNested()
  @Type(() => LotDto)
  lot: LotDto;
}
