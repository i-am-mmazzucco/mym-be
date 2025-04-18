import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ClientDto } from '../clients/clients.dto';
import { RoutesService } from '../routes/routes.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private routesService: RoutesService,
  ) {}

  async findAllClients() {
    return this.userRepository.find({ where: { role: 'CLIENT' } });
  }

  async findClient(id: number) {
    return this.userRepository.findOne({ where: { id, role: 'CLIENT' } });
  }

  async findClientByDni(dni: string) {
    return this.userRepository.findOne({ where: { dni, role: 'CLIENT' } });
  }

  async createClient(body: ClientDto) {
    const client = await this.findClientByDni(body.dni);
    if (client) {
      throw new Error('Client already exists');
    }

    let routes = [];
    if (body.routes.length) {
      routes = await this.routesService.create(body.routes);
    }
    const newClient = this.userRepository.create({ ...body, routes });
    return this.userRepository.save(newClient);
  }

  async updateClient(id: number, body: ClientDto) {
    const client = await this.findClient(id);
    if (!client) {
      throw new Error('Client not found');
    }
    let routes = [];
    if (body.routes?.length) {
      routes = await this.routesService.create(body.routes);
    }
    return this.userRepository.update(id, { ...body, routes });
  }
}
