import { Body, Controller, Post } from '@nestjs/common';
import { BranchService } from './branch.service';
import { Branch } from './entity/branch.entity';

@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post('bulk')
  async bulkInsert(@Body() branches: Branch[]): Promise<Branch[]> {
    return this.branchService.bulkInsert(branches);
  }
}
