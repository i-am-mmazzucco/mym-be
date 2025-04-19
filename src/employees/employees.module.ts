// src/employees/employees.module.ts
import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { UsersModule } from '../users/users.module';
import { RoutesModule } from '../routes/routes.module';

@Module({
  imports: [UsersModule, RoutesModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
