import { InjectRepository } from '@nestjs/typeorm';
import { Routes } from './routes.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RouteDto } from './routes.dto';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Routes)
    private routesRepository: Repository<Routes>,
  ) {}

  async create(data: RouteDto[]) {
    try {
      const routes = this.routesRepository.create(data);
      return this.routesRepository.save(routes);
    } catch (error) {
      console.error('Error creating route:', error);
      throw new Error('Error creating route');
    }
  }
}
