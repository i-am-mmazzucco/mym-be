import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ClientDto, ClientUpdateDto } from './clients.dto';
import { UsersService } from '../users/users.service';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class ClientsService {
  constructor(
    private usersService: UsersService,
    private ordersService: OrdersService,
  ) {}

  async getClients() {
    const clients = await this.usersService.findAllClients();
    const clientsWithSales = await Promise.all(
      clients.map(async (client) => {
        const salesAverage = await this.getSalesAverage(+client.id);
        return {
          ...client,
          salesAverage,
        };
      }),
    );

    return clientsWithSales;
  }
  async getClient(id: string) {
    const client = await this.usersService.findClient(+id);
    if (!client) {
      throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
    }

    const salesAverage = await this.getSalesAverage(+id);

    return {
      ...client,
      salesAverage,
    };
  }

  async createClient(body: ClientDto) {
    const client = await this.usersService.findClientByDni(body.dni);
    if (client) {
      throw new HttpException('Client already exists', HttpStatus.BAD_REQUEST);
    }

    const draft = {
      ...body,
      role: 'CLIENT',
    };

    return this.usersService.createClient(draft);
  }

  async updateClient(id: string, body: ClientUpdateDto) {
    const client = await this.usersService.findClient(+id);
    if (!client) {
      throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
    }

    const updatedClient = await this.usersService.updateClient(+id, body);
    const salesAverage = await this.getSalesAverage(+id);

    return {
      ...updatedClient,
      salesAverage,
    };
  }

  private async getSalesAverage(id: number) {
    const orders = await this.ordersService.getOrders();
    const clientOrders = await this.ordersService.getOrders(id);

    return `${
      orders.length > 0 ? (clientOrders.length / orders.length) * 100 : 0
    }%`;
  }
}
