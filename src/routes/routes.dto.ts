import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class RouteDto {
  @IsNumber()
  lng: number;

  @IsNumber()
  lat: number;

  @IsNumber()
  @Type(() => Number)
  employeeId: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  orderId?: number;
}

export class RouteWithoutEmployeeDto {
  @IsNumber()
  lng: number;

  @IsNumber()
  lat: number;
}
