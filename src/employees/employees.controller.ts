import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeeDto, EmployeeUpdateDto } from './employee.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// `@UseGuards(JwtAuthGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  getEmployees(@Query() query?: { withoutRoutes: boolean }) {
    return this.employeesService.getEmployees(query);
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
