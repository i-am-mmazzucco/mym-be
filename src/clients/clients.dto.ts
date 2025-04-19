import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

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
}
