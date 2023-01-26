import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }
    async createUser(createUserDto: CreateUserDto): Promise<any>{
        const checkUSerExist = await this.checkUSerExist(createUserDto.email);
        if(checkUSerExist){
            return { "message": "email already exists" }
        }else{
            const user = this.userRepo.create(createUserDto);
            return await this.userRepo.save(user);
        }
    }

    async checkUSerExist(email: string): Promise<User>{
        const user = await this.userRepo.findOneBy({email : email});
        if(user){
            return user;
        }else{
            return user;
        }
    }
    async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<any> {
        if(updateUserDto?.email){
            const checkUSerExist = await this.checkUSerExist(updateUserDto.email);
            if(checkUSerExist && checkUSerExist.id!=userId){
                return { "message": "email already exists" }
            }
        }
        await this.userRepo.update(userId, updateUserDto);
        const user = await this.userRepo.findOne({
          where: { id: userId },
          select: ['id', 'full_name', 'first_name', 'last_name','email', 'is_active', 'username', 'user_type', 'created_at', 'updated_at']
        });
        if (user) {
          return user;
        }
        return null;
      }
}
