import { Injectable } from '@nestjs/common';
import { ClientDto } from './clients.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ClientsService {
  constructor(private usersService: UsersService) {}

  async getClients() {
    return this.usersService.findAllClients();
  }

  async getClient(id: string) {
    return this.usersService.findClient(+id);
  }

  async createClient(body: ClientDto) {
    return this.usersService.createClient(body);
  }

  async updateClient(id: string, body: ClientDto) {
    return this.usersService.updateClient(+id, body);
  }
}
