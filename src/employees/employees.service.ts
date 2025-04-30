import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EmployeeDto, EmployeeUpdateDto } from './employee.dto';
import { UsersService } from '../users/users.service';
import { RoutesService } from '../routes/routes.service';

@Injectable()
export class EmployeesService {
  constructor(
    private usersService: UsersService,
    private routesService: RoutesService,
  ) {}

  getEmployees(query: { withoutRoutes: boolean } = { withoutRoutes: false }) {
    return this.usersService.findAllEmployees(query);
  }

  async getEmployee(id: string) {
    const employee = await this.usersService.findEmployee(+id);
    if (!employee) {
      throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
    }

    return employee;
  }

  async createEmployee(body: EmployeeDto) {
    const employee = await this.usersService.findEmployeeByDni(body.dni);
    if (employee) {
      throw new HttpException(
        'Employee already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { route, ...rest } = body;

    const draft = {
      ...rest,
      role: 'EMPLOYEE',
    } as unknown as EmployeeDto;

    const newEmployee = await this.usersService.createEmployee(draft);

    if (route) {
      const newRoute = await this.routesService.create(route);
      await this.usersService.updateEmployee(newEmployee.id, {
        route: { id: newRoute.id },
      } as any);
      return this.usersService.findEmployee(newEmployee.id);
    }

    return newEmployee;
  }

  async updateEmployee(id: number, body: EmployeeUpdateDto) {
    const employee = await this.usersService.findEmployee(id);
    if (!employee) {
      throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
    }

    if (body.route) {
      const route = await this.routesService.create(body.route);
      body.route = { id: route.id } as any;
    }

    await this.usersService.updateEmployee(id, body);

    return this.usersService.findEmployee(id);
  }
}
