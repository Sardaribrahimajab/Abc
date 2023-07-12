import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, UpdateResult } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDTO } from '../authentication/dto/delete-user.dto';

/**
 * User Service
 */
@Injectable()
export class UserService {

  /**
   * Entry point for User Service
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  /**
   * Get user by its id
   * @param userId 
   * Id of user
   * @returns 
   * User object or null
   */
  async getUserById(userId: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      // where: { id: userId },
      // relations: ['acl']
    });

    if (user) {
      delete user.password;
      return user;
    }
    return null;
  }

  /**
   * Get user by its email
   * @param email 
   * Email of user
   * @returns 
   * User object or null
   */
  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ email: email });
    if (user) {
      return user;
    }
    return null;
  }

  /**
   * Get user even if the user is soft deleted
   * @param email 
   * Email of user
   * @returns 
   * User object or null
   */
  async getUserByEmailincludingDeleted(email: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { email: email },
      withDeleted: true
    });
    if (user) {
      return user;
    }
    return null;
  }

  /**
   * Create user
   * @param createUserDto 
   * Create User Dto
   * @param otp 
   * OTP
   * @returns 
   * Saved user object
   */
  async createUser(createUserDto: CreateUserDto, otp?: string): Promise<User> {
    const user = this.userRepo.create(createUserDto);
    return await this.userRepo.save(user);
  }

  /**
   * Update user
   * @param userId 
   * Id of user
   * @param updateUserDto 
   * Update User Dto
   * @returns 
   * User object or null
   */
  async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepo.update(userId, updateUserDto);
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'full_name', 'first_name', 'last_name', 'email', 'is_active','username', 'user_type', 'created_at', 'updated_at']
    });
    if (user) {
      return user;
    }
    return null;
  }

  /**
   * Delete user
   * @param user 
   * Caller of api
   * @param deleteUserDto 
   * Delete User Dto
   * @returns 
   * Result object
   */
  async deleteUser(user: User, deleteUserDto: DeleteUserDTO) {
    await this.userRepo.softDelete(user.id)
    return {
      statusCode: HttpStatus.OK,
      message: 'User successfully deleted'
    };
  }

  /**
   * Restore user
   * @param userId 
   * Id of user
   * @returns 
   * Restored user
   */
  async restroreUser(userId: number): Promise<User> {
    const newUser = await this.userRepo.findOne({
      where: { id: userId },
      withDeleted: true
    })
    const returnUser = await this.userRepo.save(newUser);
    await this.userRepo.restore(newUser.id);
    return returnUser;
  }

  /**
   * Update password of user
   * @param userId 
   * Id of user
   * @param password
   * New password hash
   * @returns 
   * Updated user object
   */
  async updatePassword(userId: number, password: string): Promise<User> {
    await this.userRepo.update(userId, { password })
    const user = await this.userRepo.findOneBy({ id: userId })
    if (user) {
      return user;
    }
  }

  /**
   * Update any user field
   * @param email 
   * Email of user
   * @param fieldname
   * Field name 
   * @param fieldValue 
   * @returns 
   */
  async updateUserField(email: string, fieldname: string, fieldValue: string): Promise<User> {
    const user = await this.getUserByEmail(email)
    if (user) {
      await this.userRepo.update(user.id, { [fieldname]: fieldValue });
      const updatedUser = await this.userRepo.findOneBy({ id: user.id });
      return updatedUser;
    }
    return null;
  }

  /**
   * Save user to db
   * @param user 
   * User to be saved
   */
  async saveUser(user: User) {
    await this.userRepo.save(user);
  }
}
