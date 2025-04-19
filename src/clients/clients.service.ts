import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ClientDto } from './clients.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ClientsService {
  constructor(private usersService: UsersService) {}

  async getClients() {
    return this.usersService.findAllClients();
  }

  async getClient(id: string) {
    const client = await this.usersService.findClient(+id);
    if (!client) {
      throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
    }

    return client;
  }

  async createClient(body: ClientDto) {
    const client = await this.usersService.findClientByDni(body.dni);
    if (client) {
      throw new HttpException('Client already exists', HttpStatus.BAD_REQUEST);
    }

    return this.usersService.createClient(body);
  }

  async updateClient(id: string, body: ClientDto) {
    const client = await this.usersService.findClient(+id);
    if (!client) {
      throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
    }

    return this.usersService.updateClient(+id, body);
  }
}
