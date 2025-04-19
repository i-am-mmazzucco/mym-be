import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ClientDto, ClientUpdateDto } from '../clients/clients.dto';
import { EmployeeDto, EmployeeUpdateDto } from 'src/employees/employee.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  // clients
  async findAllClients() {
    const users = await this.userRepository.find({
      where: { role: 'CLIENT' },
    });

    return users.map((user) => {
      delete user?.password;
      return user;
    });
  }

  async findClient(id: number) {
    const user = await this.userRepository.findOne({
      where: { id, role: 'CLIENT' },
    });

    delete user?.password;

    return user;
  }

  async findClientByDni(dni: string) {
    const user = await this.userRepository.findOne({
      where: { dni, role: 'CLIENT' },
    });

    delete user?.password;

    return user;
  }

  async createClient(body: ClientDto) {
    const newClient = this.userRepository.create(body);
    const savedClient = await this.userRepository.save(newClient);

    delete savedClient.password;

    return savedClient;
  }

  async updateClient(id: number, body: ClientUpdateDto) {
    await this.userRepository.update(id, body);

    return this.findClient(id);
  }

  // employees
  async findAllEmployees() {
    const users = await this.userRepository.find({
      where: { role: 'EMPLOYEE' },
    });

    return users.map((user) => {
      delete user.password;
      return user;
    });
  }

  async findEmployee(id: number) {
    const user = await this.userRepository.findOne({
      where: { id, role: 'EMPLOYEE' },
      relations: ['route'],
    });

    delete user?.password;

    return user;
  }

  async findEmployeeByDni(dni: string) {
    const user = await this.userRepository.findOne({
      where: { dni, role: 'EMPLOYEE' },
      relations: ['route'],
    });

    delete user?.password;

    return user;
  }

  async createEmployee(body: EmployeeDto) {
    const newEmployee = this.userRepository.create(body);
    const savedEmployee = await this.userRepository.save(newEmployee);

    delete savedEmployee.password;

    return savedEmployee;
  }

  async updateEmployee(id: number, body: EmployeeUpdateDto) {
    await this.userRepository.update(id, body);

    return this.findEmployee(id);
  }
}
