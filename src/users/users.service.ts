import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  ClientDto,
  ClientUpdateDto,
  SearchClientDto,
} from '../clients/clients.dto';
import {
  EmployeeDto,
  EmployeeUpdateDto,
  SearchEmployeeDto,
} from '../employees/employee.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  // clients
  async findAllClients({ q }: SearchClientDto) {
    const query = this.userRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: 'CLIENT' });

    if (q) {
      query.andWhere(
        '(LOWER(user.name) LIKE LOWER(:searchTerm) OR ' +
          'LOWER(user.lastName) LIKE LOWER(:searchTerm) OR ' +
          'LOWER(user.address) LIKE LOWER(:searchTerm) OR ' +
          'LOWER(user.phone) LIKE LOWER(:searchTerm))',
        { searchTerm: `%${q}%` },
      );
    }

    const users = await query.getMany();

    return users;
  }

  async findClient(id: number) {
    const user = await this.userRepository.findOne({
      where: { id, role: 'CLIENT' },
    });

    return user;
  }

  async findClientByDni(dni: string) {
    const user = await this.userRepository.findOne({
      where: { dni, role: 'CLIENT' },
    });

    return user;
  }

  async createClient(body: ClientDto) {
    const newClient = this.userRepository.create(body);
    const savedClient = await this.userRepository.save(newClient);

    return savedClient;
  }

  async updateClient(id: number, body: ClientUpdateDto) {
    await this.userRepository.update(id, body);

    return this.findClient(id);
  }

  // employees
  async findAllEmployees({ q, withoutRoutes }: SearchEmployeeDto) {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.routes', 'routes')
      .where('user.role = :role', { role: 'EMPLOYEE' });

    if (q) {
      query.andWhere(
        '(LOWER(user.name) LIKE LOWER(:searchTerm) OR ' +
          'LOWER(user.lastName) LIKE LOWER(:searchTerm) OR ' +
          'LOWER(user.dni) LIKE LOWER(:searchTerm) OR ' +
          'LOWER(user.phone) LIKE LOWER(:searchTerm))',
        { searchTerm: `%${q}%` },
      );
    }

    if (withoutRoutes) {
      query.andWhere('user.routes.id IS NULL');
    }

    const users = await query.getMany();

    return users;
  }

  async findEmployee(id: number) {
    const user = await this.userRepository.findOne({
      where: { id, role: 'EMPLOYEE' },
      relations: ['routes'],
    });

    return user;
  }

  async findEmployeeByDni(dni: string) {
    const user = await this.userRepository.findOne({
      where: { dni, role: 'EMPLOYEE' },
      relations: ['routes'],
    });

    return user;
  }

  async createEmployee(body: EmployeeDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { routes, ...rest } = body;
    const newEmployee = this.userRepository.create(rest);
    const savedEmployee = await this.userRepository.save(newEmployee);

    return savedEmployee;
  }

  async updateEmployee(id: number, body: EmployeeUpdateDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { routes, order, ...rest } = body;
    await this.userRepository.update(id, rest);

    return this.findEmployee(id);
  }
}
