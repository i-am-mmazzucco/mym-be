import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeeDto, EmployeeUpdateDto } from './employee.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
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
  createEmployee(@Body() employeeData: EmployeeDto) {
    return this.employeesService.createEmployee(employeeData);
  }

  @Patch(':id')
  updateEmployee(
    @Param('id') id: string,
    @Body() employeeData: EmployeeUpdateDto,
  ) {
    return this.employeesService.updateEmployee(+id, employeeData);
  }
}
