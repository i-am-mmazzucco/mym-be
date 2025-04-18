import { InjectRepository } from '@nestjs/typeorm';
import { Lot } from './lot.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LotDto } from './lot.dto';

@Injectable()
export class LotService {
  constructor(
    @InjectRepository(Lot)
    private lotRepository: Repository<Lot>,
  ) {}

  async createLot(data: LotDto) {
    try {
      const lot = this.lotRepository.create(data);
      return this.lotRepository.save(lot);
    } catch (error) {
      console.error('Error creating lot:', error);
      throw new Error('Error creating lot');
    }
  }
}
