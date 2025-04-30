import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ClientDto, ClientUpdateDto } from '../clients/clients.dto';
import { EmployeeDto, EmployeeUpdateDto } from '../employees/employee.dto';

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
  async findAllEmployees({ withoutRoutes }: { withoutRoutes: boolean }) {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.route', 'route')
      .where('user.role = :role', { role: 'EMPLOYEE' });

    if (withoutRoutes) {
      query.andWhere('route.id IS NULL');
    }

    const users = await query.getMany();

    return users;
  }

  async findEmployee(id: number) {
    const user = await this.userRepository.findOne({
      where: { id, role: 'EMPLOYEE' },
      relations: ['route'],
    });

    return user;
  }

  async findEmployeeByDni(dni: string) {
    const user = await this.userRepository.findOne({
      where: { dni, role: 'EMPLOYEE' },
      relations: ['route'],
    });

    return user;
  }

  async createEmployee(body: EmployeeDto) {
    const newEmployee = this.userRepository.create(body);
    const savedEmployee = await this.userRepository.save(newEmployee);

    return savedEmployee;
  }

  async updateEmployee(id: number, body: EmployeeUpdateDto) {
    await this.userRepository.update(id, body);

    return this.findEmployee(id);
  }
}
