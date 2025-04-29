import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { Product } from './products/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users/users.entity';
import { Routes } from './routes/routes.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Lot } from './lot/lot.entity';
import { ClientsModule } from './clients/clients.module';
import { EmployeesModule } from './employees/employees.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { MeModule } from './me/me.module';
import { Item } from './items/items.entity';
import { Order } from './orders/orders.entity';
import { Auth } from './auth/auth.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ProductsModule,
    ClientsModule,
    EmployeesModule,
    OrdersModule,
    MeModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: configService.get<'postgres'>('DB_TYPE'),
          host: configService.get<string>('DB_HOST'),
          port: +configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [Product, Users, Routes, Lot, Order, Auth, Item],
          synchronize: true,
        };
      },
    }),
  ],
})
export class AppModule {}
