// src/clients/clients.module.ts
import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [UsersModule, OrdersModule],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
