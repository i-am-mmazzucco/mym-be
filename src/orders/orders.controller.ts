// src/orders/orders.controller.ts
import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Body() orderData: any) {
    return this.ordersService.createOrder(orderData);
  }

  @Get()
  getOrders() {
    return this.ordersService.getOrders();
  }

  @Get(':id')
  getOrder(@Param('id') id: string) {
    return this.ordersService.getOrder(id);
  }

  @Patch(':id')
  updateOrder(@Param('id') id: string, @Body() orderData: any) {
    return this.ordersService.updateOrder(id, orderData);
  }
}