import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class RouteDto {
  @IsNumber()
  @Type(() => Number)
  latitude: number;

  @IsNumber()
  @Type(() => Number)
  longitude: number;
}
