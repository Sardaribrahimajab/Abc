import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sales } from './entity/sales.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sales])],
  providers: [SalesService],
  exports: [SalesService],
})
export class SalesModule {}
