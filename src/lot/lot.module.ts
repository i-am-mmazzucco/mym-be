import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lot } from './lot.entity';
import { LotService } from './lot.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lot])],
  providers: [LotService],
  exports: [LotService],
})
export class LotModule {}
