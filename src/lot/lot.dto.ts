import { IsEnum, IsNumber, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class LotDto {
  @IsEnum(['kg', 'g', 'ml', 'l'])
  unitOfMeasure: 'kg' | 'g' | 'ml' | 'l';

  @IsNumber()
  quantity: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  manufactureDate: Date = new Date();

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  expirationDate: Date = new Date(
    new Date().setFullYear(new Date().getFullYear() + 1),
  );
}
