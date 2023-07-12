import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, UpdateResult } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../enum/role.enum';
import { DeleteUserDTO } from '../authentication/dto/delete-user.dto';
import { ProfilePicKeyDto } from '../authentication/dto/profile-pic-key.dto';

/**
 * User Service
 */
@Injectable()
export class UserService {

  /**
   * Entry point for User Service
   */
  constructor(
    // @InjectRepository(Project)
    // private readonly projectRepo: Repository<Project>,
    // @InjectRepository(AgencyProfile)
    // private readonly agencyRepo: Repository<AgencyProfile>,
    // @InjectRepository(AgentProfile)
    // private readonly agentRepo: Repository<AgentProfile>,
    // @InjectRepository(Tour)
    // private readonly tourRepo: Repository<Tour>,
    // @InjectRepository(Shortlist)
    // private readonly shortlistRepo: Repository<Shortlist>,
    // @InjectRepository(Property)
    // private readonly propertyRepo: Repository<Property>,
    // @InjectRepository(PropertyGallery)
    // private readonly propertyGalleryRepo: Repository<PropertyGallery>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  /**
   * Get list of users according the criteria
   * @param page 
   * Page no
   * @param limit
   * Limit of records on a page 
   * @param sortBy 
   * Name of column on which the records will be sorted
   * @param name 
   * Full name of user
   * @returns 
   */
//   async getAllUser(page: number, limit: number, sortBy: string, name: string = '') {
//     const sort = sortBy ? sortBy : "created_at"
//     const count = await this.userRepo.count({
//       where: [
//         { user_type: Role.OWNER, full_name: Like(`%${name}%`) },
//         { user_type: Role.SUPER_ADMIN, full_name: Like(`%${name}%`) },
//       ]
//     });
//     const qb = await this.userRepo.find({
//       where: [
//         { user_type: Role.OWNER, full_name: Like(`%${name}%`) },
//         { user_type: Role.SUPER_ADMIN, full_name: Like(`%${name}%`) }
//       ],
//       select: ['id', 'full_name', 'first_name', 'last_name','email', 'is_active',
//         'username', 'user_type', 'created_at', 'updated_at'],
//       skip: (page - 1) * limit,
//       take: limit,
//       order: { [sort]: "DESC" },
//     });
//     return { items: qb, meta: { totalItems: count, totalPages: (Math.ceil(count / limit)), itemsPerPage: limit } }
//   }

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
   * Get user by its id
   * @param userId 
   * Id of user
   * @returns 
   * User object or null
   */
//   async getUserByIdIncludingRelations(userId: number): Promise<User> {
//     const user = await this.userRepo.findOne({
//       where: { id: userId },
//       relations: ["projects", "properties", "agency_profile", "agent_profile", "shortlist", "tours"],
//     });

//     if (user) {
//       delete user.password;
//       delete user.otp;
//       return user;
//     }
//     return null;
//   }

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
   * Get user with its acl
   * @param email 
   * Email of user
   * @returns 
   * User object or null
   */
//   async getUserWithACL(email: string): Promise<User> {
//     const user = await this.userRepo.findOne({
//       where: { email: email },
//       relations: ['acl']
//     });

//     if (user) {
//       if (user.user_type === Role.AGENT) {
//         const user1 = await this.userRepo.findOne({
//           where: { email: email },
//           relations: ['acl', 'agent_profile', 'agent_profile.agency']
//         });
//         if (user1.agent_profile && user1.agent_profile.agency) {
//           user1['agent_id'] = user1.agent_profile.id;
//           user1['agency_id'] = user1.agent_profile.agency.id;
//           delete user1.agent_profile;
//         }
//         return user1;
//       }
//       return user;
//     }
//     return null;
//   }

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
    // if (user.user_type !== Role.SUPER_ADMIN) {
    //   return {
    //     statusCode: HttpStatus.FORBIDDEN,
    //     message: 'Operation not allowed'
    //   };
    // }
    // const newUser = await this.userRepo.findOne({
    //   where: { id: deleteUserDto.id },
    //   relations: ["projects", "properties", "agency_profile", "agent_profile", "shortlist", "tours"],
    // })
    // if (newUser.projects) {
    //   newUser.projects.forEach(async project => {
    //     await this.projectRepo.softDelete(project.id)
    //   })
    // }
    // if (newUser.properties) {
    //   newUser.properties.forEach(async property => {
    //     await this.propertyRepo.softDelete(property.id)
    //   })
    // }
    // if (newUser.agency_profile) {
    //   const agency = await this.agencyRepo.findOne(
    //     {
    //       where: { id: newUser.agency_profile.id },
    //       relations: {
    //         agents: true
    //       }
    //     }
    //   )
    //   if (agency.agents) {
    //     agency.agents.forEach(async agent => {
    //       const newAgent = await this.agentRepo.findOne(
    //         {
    //           where: { id: agent.id },
    //           relations: {
    //             user: true
    //           }
    //         }
    //       )
    //       const agentUser = await this.userRepo.findOne(
    //         {
    //           where: { id: newAgent.user.id },
    //           relations: ["projects", "properties", "shortlist", "tours"]
    //         }
    //       )
    //       if (agentUser.projects) {
    //         agentUser.projects.forEach(async project => {
    //           await this.projectRepo.softDelete(project.id)
    //         })
    //       }
    //       if (agentUser.properties) {
    //         agentUser.properties.forEach(async property => {
    //           await this.propertyRepo.softDelete(property.id)
    //         })
    //       }
    //       if (agentUser.tours) {
    //         agentUser.tours.forEach(async tour => {
    //           await this.tourRepo.softDelete(tour.id)
    //         })
    //       }
    //       if (agentUser.shortlist) {
    //         agentUser.shortlist.forEach(async shortlist => {
    //           await this.shortlistRepo.softDelete(shortlist.id)
    //         })
    //       }
    //       await this.userRepo.softDelete(agentUser)
    //       await this.agentRepo.softDelete(newAgent)
    //     }

    //     )
    //   }
    //   await this.agencyRepo.softDelete(newUser.agency_profile.id)
    // }
    // if (newUser.agent_profile) {
    //   await this.agentRepo.softDelete(newUser.agent_profile.id)
    // }
    // if (newUser.tours) {
    //   newUser.tours.forEach(async tour => {
    //     await this.tourRepo.softDelete(tour.id)
    //   })
    // }
    // if (newUser.shortlist) {
    //   newUser.shortlist.forEach(async shortlist => {
    //     await this.shortlistRepo.softDelete(shortlist.id)
    //   })
    // }

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

  /**
   * Get pending approvals
   * @returns 
   * Result object
   */
//   async getPendingApprovals() {
//     const agents = await this.userRepo.find({
//       where: { is_admin_approved: false, user_type: Role.AGENT },
//       relations: ["agent_profile"],
//       select: ['id', 'full_name', 'first_name', 'last_name', 'address', 'city', 'email', 'is_active',
//         'mobile', 'postal_code', 'profile_pic', 'username', 'user_type', 'is_admin_approved', 'created_at', 'updated_at'],
//       order: { updated_at: "DESC" }
//     });

//     const agencies = await this.userRepo.find({
//       where: { is_admin_approved: false, user_type: Role.AGENCY_ADMIN },
//       relations: ["agency_profile"],
//       select: ['id', 'full_name', 'first_name', 'last_name', 'address', 'city', 'email', 'is_active',
//         'mobile', 'postal_code', 'profile_pic', 'username', 'user_type', 'is_admin_approved', 'created_at', 'updated_at'],
//       order: { updated_at: "DESC" }
//     });

//     const super_admins = await this.userRepo.find({
//       where: { is_admin_approved: false, user_type: Role.SUPER_ADMIN },
//       select: ['id', 'full_name', 'first_name', 'last_name', 'address', 'city', 'email', 'is_active',
//         'mobile', 'postal_code', 'profile_pic', 'username', 'user_type', 'is_admin_approved', 'created_at', 'updated_at'],
//       order: { updated_at: "DESC" }
//     });

//     return {
//       agents: agents,
//       agencies: agencies,
//       admins: super_admins
//     };

//   }

  /**
   * Block a user by its id
   * @param userId 
   * Id of user
   * @returns 
   * Result object
   */
//   async BlockUserByAdmin(userId: number) {
//     const user = await this.userRepo.findOne({ where: { id: userId } });
//     if (user) {
//       user.is_admin_approved = false;
//       const userSaved = await this.userRepo.save(user);
//       return {
//         statusCode: HttpStatus.OK,
//         message: 'Successfully Updated',
//         user: userSaved
//       };
//     }
//     return {
//       statusCode: HttpStatus.NOT_FOUND,
//       message: 'user not found'
//     };
//   }

  /**
   * Update admin approval
   * @param userId 
   * Id of user
   * @returns 
   * Saved user object or exception
   */
//   async updateAdminApproval(userId: number) {
//     const user = await this.userRepo.findOne({ where: { id: userId } });
//     if (user) {
//       user.is_admin_approved = true;
//       return await this.userRepo.save(user);
//     }
//     throw new HttpException("userId not found", HttpStatus.NOT_FOUND);
//   }

  /**
   * Get list of blocked/unblocked user according the criteria
   * @param page 
   * Page no
   * @param limit
   * Limit of records on a page
   * @param status 
   * Status of blocked or unblocked
   * @param sortBy 
   * Name of column on which the records will be sorted
   * @returns 
   * List of users meeting the criteria
   */
//   async getBlockedUsers(page: number, limit: number, status: string, sortBy: string) {
//     const sort = sortBy ? sortBy : "created_at"
//     const statusBoolean = status === "blocked" ? false : true;
//     const count = await this.userRepo.count({
//       where: { is_admin_approved: statusBoolean }
//     })
//     const qb = await this.userRepo.find({
//       where: { is_admin_approved: statusBoolean },
//       skip: (page - 1) * limit,
//       take: limit,
//       order: { [sort]: "DESC" },
//     });
//     return { items: qb, meta: { totalItems: count, totalPages: (Math.ceil(count / limit)), itemsPerPage: limit } }
//   }

  /**
   * Update user profile picture
   * @param user 
   * Caller of api
   * @param body 
   * Profile Pic Key Dto
   * @returns 
   * Updated user or message
   */
//   async updateProfilePic(user: User, body: ProfilePicKeyDto) {
//     const userFetched = await this.userRepo.findOne({ where: { id: user.id } });
//     if (userFetched && body.key) {
//       userFetched.profile_pic = body.key;
//       userFetched.profile_pic_thumbnail = body.key + '_thumbnail';
//       await this.userRepo.save(userFetched);
//       return await this.userRepo.findOne({
//         where: { id: userFetched.id },
//         select: ['id', 'full_name', 'first_name', 'last_name', 'address', 'city', 'email', 'is_active',
//           'mobile', 'postal_code', 'profile_pic', 'profile_pic_thumbnail', 'username', 'user_type', 'is_admin_approved', 'created_at', 'updated_at']
//       });
//     }
//     else {
//       return { 'message': 'Failed to Update Profile Picture' };
//     }
//   }

}
