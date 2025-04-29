import { RouteDto } from '../routes/routes.dto';
import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ClientDto, ClientUpdateDto } from '../clients/clients.dto';

export class EmployeeDto extends ClientDto {
  @Type(() => RouteDto)
  @IsOptional()
  route: RouteDto;
}

export class EmployeeUpdateDto extends ClientUpdateDto {
  @Type(() => RouteDto)
  @IsOptional()
  route: RouteDto;
}
