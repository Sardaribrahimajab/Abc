import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CommissionService } from './commssion.service';
import { Commission } from './entity/commission.entity';

@Controller('commission')
export class CommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  @Post('calculate')
  @UseInterceptors(AnyFilesInterceptor())
  async calculateCommission(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() data,
  ) {
    const response = await this.commissionService.calculateCommission(
      files,
      data.isPromotional ==='true',
    );
    return response;
  }

  @Post('bulk')
  async bulkInsert(@Body() commissions: Commission[]): Promise<Commission[]> {
    return this.commissionService.bulkInsert(commissions);
  }
}
