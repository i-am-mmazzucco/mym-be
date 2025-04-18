import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Routes } from './routes.entity';
import { RoutesService } from './routes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Routes])],
  providers: [RoutesService],
  exports: [RoutesService],
})
export class RoutesModule {}
