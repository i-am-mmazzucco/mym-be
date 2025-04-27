// src/orders/orders.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './orders.entity';
import { CreateOrderDto, UpdateOrderDto } from './orders.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.ordersRepository.create(createOrderDto);
    return this.ordersRepository.save(order);
  }

  async getOrders(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['client', 'employeeAssigned', 'items', 'items.product'],
    });
  }

  async getOrder(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['client', 'employeeAssigned', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async updateOrder(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.getOrder(id);

    // Update order fields
    Object.assign(order, updateOrderDto);

    return this.ordersRepository.save(order);
  }

  async deleteOrder(id: number): Promise<void> {
    const result = await this.ordersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }
}
