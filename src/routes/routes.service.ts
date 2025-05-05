import { InjectRepository } from '@nestjs/typeorm';
import { Routes } from './routes.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RouteDto } from './routes.dto';
import { Point } from 'geojson';
@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Routes)
    private routesRepository: Repository<Routes>,
  ) {}

  async create(data: RouteDto) {
    try {
      const { employeeId, lat, lng, orderId } = data;

      const coordinates: Point = {
        type: 'Point',
        coordinates: [lng, lat],
      };

      const routeData: any = {
        coordinates,
        employee: { id: employeeId },
      };

      if (orderId) {
        routeData.order = { id: orderId };
      }

      const route = this.routesRepository.create(routeData);
      return this.routesRepository.save(route);
    } catch (error) {
      console.error('Error creating route:', error);
      throw new Error('Error creating route');
    }
  }

  async findRoutesByEmployeeId(employeeId: number) {
    return this.routesRepository.find({
      where: { employee: { id: employeeId } },
      relations: ['order'],
    });
  }
}
