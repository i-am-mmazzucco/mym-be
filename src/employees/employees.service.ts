import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  EmployeeDto,
  EmployeeUpdateDto,
  SearchEmployeeDto,
} from './employee.dto';
import { UsersService } from '../users/users.service';
import { RoutesService } from '../routes/routes.service';
import { OrdersService } from '../orders/orders.service';
import { Routes } from 'src/routes/routes.entity';

@Injectable()
export class EmployeesService {
  constructor(
    private usersService: UsersService,
    private routesService: RoutesService,
    private ordersService: OrdersService,
  ) {}

  getEmployees(query: SearchEmployeeDto) {
    const { q, withoutRoutes } = query || { withoutRoutes: false };
    return this.usersService.findAllEmployees({ q, withoutRoutes });
  }

  async getEmployee(id: string) {
    const employee = await this.usersService.findEmployee(+id);
    if (!employee) {
      throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
    }

    const routes = await this.routesService.findRoutesByEmployeeId(employee.id);

    return {
      ...employee,
      routes,
    };
  }

  async createEmployee(body: EmployeeDto) {
    const employee = await this.usersService.findEmployeeByDni(body.dni);
    if (employee) {
      throw new HttpException(
        'Employee already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { routes, ...rest } = body;

    const draft = {
      ...rest,
      role: 'EMPLOYEE',
    } as unknown as EmployeeDto;

    const newEmployee = await this.usersService.createEmployee(draft);

    if (routes?.length) {
      for (const route of routes) {
        await this.routesService.create({
          ...route,
          employeeId: newEmployee.id,
        });
      }
    }

    const updatedRoutes = await this.routesService.findRoutesByEmployeeId(
      newEmployee.id,
    );

    return {
      ...newEmployee,
      routes: updatedRoutes,
    };
  }

  async updateEmployee(id: number, body: EmployeeUpdateDto) {
    const employee = await this.usersService.findEmployee(id);
    if (!employee) {
      throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
    }

    const order = await this.ordersService.getOrder(+body.order.id);
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    if (body.routes && body.routes.length) {
      if (body.routes.length === 1 && body.order) {
        const newRoute = await this.routesService.create({
          ...body.routes[0],
          orderId: order.id,
          employeeId: id,
        });
        await this.ordersService.setOrderRoute(
          order.id,
          (newRoute as unknown as Routes).id,
        );
      } else {
        for (const route of body.routes) {
          await this.routesService.create({
            ...route,
            employeeId: id,
          });
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { routes, ...rest } = body;

    await this.usersService.updateEmployee(id, rest as EmployeeUpdateDto);

    const updatedEmployee = await this.usersService.findEmployee(id);
    const updatedRoutes = await this.routesService.findRoutesByEmployeeId(id);

    return {
      ...updatedEmployee,
      routes: updatedRoutes,
    };
  }
}
