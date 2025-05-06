// src/orders/orders.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './orders.entity';
import { Item } from '../items/items.entity';
import {
  CreateItemDto,
  CreateOrderDto,
  SearchOrderDto,
  UpdateItemDto,
  UpdateOrderDto,
} from './orders.dto';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { isDate } from '../helpers/date';
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
    private usersService: UsersService,
    private productsService: ProductsService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const employee = await this.getAndValidateEmployee(
      createOrderDto.employeeAssigned.id,
    );
    const client = await this.getAndValidateClient(createOrderDto.client.id);
    await this.validateItems(createOrderDto.items);

    const items = [];
    let totalAmount = 0;

    for (const item of createOrderDto.items) {
      const product = await this.productsService.findProduct(item.product.id);
      const draftItem = this.itemsRepository.create({
        ...item,
        product: product,
      });
      const savedItem = await this.itemsRepository.save(draftItem);
      items.push(savedItem);
      totalAmount += product.price * item.quantity;
    }

    const draft = {
      ...createOrderDto,
      statusDelivery: createOrderDto.statusDelivery || 'pending',
      statusPayment: createOrderDto.statusPayment || 'pending',
      typePayment: createOrderDto.typePayment || 'cash',
      totalAmount,
      items,
      employeeAssigned: employee,
      client,
    };
    const order = this.ordersRepository.create(draft);
    return this.ordersRepository.save(order);
  }

  async getOrders(query: SearchOrderDto): Promise<Order[]> {
    const { q, clientId } = query || {};

    const queryBuilder = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.employeeAssigned', 'employeeAssigned')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('product.lot', 'lot')
      .leftJoinAndSelect('order.route', 'route');

    if (clientId) {
      queryBuilder.andWhere('order.clientId = :clientId', {
        clientId: +clientId,
      });
    }

    if (q) {
      queryBuilder.andWhere(
        `(LOWER(client.name) LIKE LOWER(:name) OR 
          LOWER(client.lastName) LIKE LOWER(:lastName) OR 
          LOWER(order.statusDelivery) = LOWER(:status)${
            !isNaN(Number(q)) ? ' OR order.id = :id' : ''
          }${isDate(q) ? ' OR DATE(order.createdAt) = :date' : ''})`,
        {
          name: `%${q}%`,
          lastName: `%${q}%`,
          status: q,
          ...(!isNaN(Number(q)) && { id: +q }),
          ...(isDate(q) && { date: new Date(q).toISOString().split('T')[0] }),
        },
      );
    }

    return queryBuilder.getMany();
  }

  async getSalesHistory(startDate?: Date, endDate?: Date) {
    const query = this.itemsRepository
      .createQueryBuilder('item')
      .select('product.id', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('lot.expirationDate', 'lotExpirationDate')
      .addSelect('lot.quantity', 'lotQuantity')
      .addSelect('lot.unitOfMeasure', 'lotUnitOfMeasure')
      .addSelect('SUM(item.quantity)', 'totalsold')
      .addSelect('SUM(item.quantity * product.price)', 'totalRevenue')
      .addSelect("DATE_TRUNC('day', order.createdAt)", 'date')
      .innerJoin('item.product', 'product')
      .innerJoin('item.order', 'order')
      .innerJoin('product.lot', 'lot')
      .groupBy(
        'product.id, date, lot.expirationDate, lot.quantity, lot.unitOfMeasure',
      )
      .orderBy('totalsold', 'DESC');

    if (startDate && endDate) {
      query.where('order.createdAt BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      });
    }

    const salesHistory = await query.getRawMany();

    return salesHistory.map(({ totalsold, ...sale }) => ({
      ...sale,
      totalSold: totalsold,
    }));
  }

  async getOrder(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: [
        'client',
        'employeeAssigned',
        'items',
        'items.product',
        'items.product.lot',
        'route',
      ],
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
    const oldOrder = await this.getOrder(id);

    await this.validateItems(updateOrderDto.items);

    const items = [];
    let totalAmount = 0;

    for (const item of updateOrderDto.items) {
      const oldItem = oldOrder.items.find(
        (i) => i.product.id === item.product.id,
      );

      if (oldItem && oldItem.quantity !== item.quantity) {
        const draftItem = this.itemsRepository.create({
          ...oldItem,
          quantity: item.quantity,
        });
        const savedItem = await this.itemsRepository.save(draftItem);
        items.push(savedItem);
        totalAmount += oldItem.product.price * item.quantity;
      } else if (!oldItem) {
        const product = await this.productsService.findProduct(item.product.id);
        const draftItem = this.itemsRepository.create({
          ...item,
          product: product,
        });
        const savedItem = await this.itemsRepository.save(draftItem);
        items.push(savedItem);
        totalAmount += product.price * item.quantity;
      } else {
        items.push(oldItem);
        totalAmount += oldItem.product.price * oldItem.quantity;
      }
    }

    const draft = {
      ...updateOrderDto,
      statusDelivery:
        updateOrderDto.statusDelivery || oldOrder.statusDelivery || 'pending',
      statusPayment:
        updateOrderDto.statusPayment || oldOrder.statusPayment || 'pending',
      typePayment: updateOrderDto.typePayment || oldOrder.typePayment || 'cash',
      totalAmount:
        updateOrderDto.totalAmount || oldOrder.totalAmount || totalAmount,
      totalAmountPaid:
        updateOrderDto.totalAmountPaid ||
        oldOrder.totalAmountPaid ||
        totalAmount,
      items,
    };

    const { items: newItems, ...orderData } = draft;

    await this.ordersRepository.update(oldOrder.id, orderData as Order);

    await this.itemsRepository.delete({ order: { id: oldOrder.id } });
    for (const item of newItems) {
      const product = await this.productsService.findProduct(item.product.id);
      const newItem = this.itemsRepository.create({
        ...item,
        product,
        order: oldOrder,
      });
      await this.itemsRepository.save(newItem);
    }

    return this.getOrder(id);
  }

  async setOrderRoute(id: number, routeId: number): Promise<Order> {
    const order = await this.getOrder(id);
    const draft = this.ordersRepository.create({
      ...order,
      route: { id: routeId },
    });
    return this.ordersRepository.save(draft);
  }

  async deleteOrder(id: number): Promise<void> {
    const result = await this.ordersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }

  private async getAndValidateEmployee(employeeId: number) {
    const employee = await this.usersService.findEmployee(employeeId);
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }
    return employee;
  }

  private async getAndValidateClient(clientId: number) {
    const client = await this.usersService.findClient(clientId);
    if (!client) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }
    return client;
  }

  private async validateItems(items: CreateItemDto[] | UpdateItemDto[]) {
    for (const item of items) {
      const product = await this.productsService.findProduct(item.product.id);
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.product.id} not found`,
        );
      }

      if (product.lot.expirationDate < new Date()) {
        throw new BadRequestException(
          `Product with ID ${item.product.id} has expired`,
        );
      }

      if (product.lot.quantity < item.quantity) {
        throw new BadRequestException(
          `Product with ID ${item.product.id} has only ${product.lot.quantity} units in stock`,
        );
      }
    }
  }
}
