import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ClientDto, ClientUpdateDto } from './clients.dto';
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

    const draft = {
      ...body,
      role: 'CLIENT',
      image: body.image
        ? body.image
        : 'https://commons.wikimedia.org/wiki/File:Default_pfp.jpg',
    };

    console.log('Llego aca')

    return this.usersService.createClient(draft);
  }

  async updateClient(id: string, body: ClientUpdateDto) {
    const client = await this.usersService.findClient(+id);
    if (!client) {
      throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
    }

    return this.usersService.updateClient(+id, body);
  }
}
