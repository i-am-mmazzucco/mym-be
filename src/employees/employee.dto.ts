import { RouteDto } from '../routes/routes.dto';
import { IsIn, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ClientDto, ClientUpdateDto } from '../clients/clients.dto';
import { OmitType } from '@nestjs/mapped-types';

export class EmployeeDto extends OmitType(ClientDto, ['role']) {
  @IsIn(['EMPLOYEE'])
  role: 'EMPLOYEE';

  @Type(() => RouteDto)
  @IsOptional()
  route: RouteDto;
}

export class EmployeeUpdateDto extends ClientUpdateDto {
  @Type(() => RouteDto)
  @IsOptional()
  route: RouteDto;
}
