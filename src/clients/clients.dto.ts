import { RouteDto } from '../routes/routes.dto';
import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  dni: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsIn(['CLIENT'])
  role: 'CLIENT';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RouteDto)
  @IsOptional()
  routes: RouteDto[];
}

export class ClientUpdateDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  dni: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RouteDto)
  @IsOptional()
  routes: RouteDto[];
}
