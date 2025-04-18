// src/employees/employees.controller.ts
import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { EmployeesService } from './employees.service';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  getEmployees() {
    return this.employeesService.getEmployees();
  }

  @Get(':id')
  getEmployee(@Param('id') id: string) {
    return this.employeesService.getEmployee(id);
  }

  @Post()
  createEmployee(@Body() employeeData: any) {
    return this.employeesService.createEmployee(employeeData);
  }

  @Patch(':id')
  updateEmployee(@Param('id') id: string, @Body() employeeData: any) {
    return this.employeesService.updateEmployee(id, employeeData);
  }
}