import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sales } from './entity/sales.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sales)
    private readonly SalesRepository: Repository<Sales>,
  ) {}

  async bulkInsert(sales: Sales[]): Promise<Sales[]> {
    return this.SalesRepository.save(sales);
  }
}
