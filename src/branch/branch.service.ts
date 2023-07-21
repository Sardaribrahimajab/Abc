import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './entity/branch.entity';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  async bulkInsert(branches: Branch[]): Promise<Branch[]> {
    return this.branchRepository.save(branches);
  }

  async getAllBranches(): Promise<Branch[]> {
    return this.branchRepository.find();
  }

  async getBranchesObject(): Promise<{
    [x: string]: Branch;
  }> {
    const response = await this.branchRepository.find();
    let branchesObject = {};
    response.forEach((data) => {
      branchesObject[data.code] = data;
    });
    return branchesObject;
  }
}
