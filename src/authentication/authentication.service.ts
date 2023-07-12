import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expiration_Time_JWT } from 'src/utils/envirmentvariable';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Role } from '../enum/role.enum';
import { User } from '../user/entity/user.entity';
import moment from 'moment';

dotenv.config();

/**
 * Authentication Service
 * 
 */
@Injectable()
export class AuthenticationService {
    /**
     * Entry point for Authentication Service
     * @param userService 
     * @param jwtService 
     * @param sendgridService 
     * @param agencyService 
     * @param verificationService 
     * @param loginRepo 
     * @param aclRepo 
     */
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    /**
     * Restore the soft deleted user
     * @param createUserDto 
     * Create User Dto
     * @returns 
     * User
     */
    async undo(createUserDto: CreateUserDto) {
        const user = await this.userService.getUserByEmailincludingDeleted(createUserDto.email)
        if (user?.deleted_at) {
            const newUser = await this.userService.restroreUser(user.id)
            return newUser
        }
        return user
    }

    /**
     * Create User
     * @param createUserDto 
     * Create User Dto
     * @returns 
     * Saved User
     */
    async createUser(createUserDto: CreateUserDto) {
        const user = await this.userService.getUserByEmailincludingDeleted(createUserDto.email)
        if (user?.deleted_at) {
            return this.undo(createUserDto)
        }
        if (user) {
            return { "message": "email already exists" }
        }
        const hash = await bcrypt.hash(createUserDto.password, 10);
        const rand = Array.from(Array(6), () => Math.floor(Math.random() * 36).toString(36)).join('');
        createUserDto.password = hash;

        const savedUser = await this.userService.createUser(createUserDto, rand);
        return savedUser;
    }

    /**
     * Validate the user against email and password
     * @param email 
     * Email of User
     * @param password
     * Password of User 
     * @returns 
     * User
     */
    async validateUser(email: string, password: string): Promise<User | any> {
        const user = await this.userService.getUserByEmail(email);
        console.log(typeof user)
        if (!user) {
            return { 'message': 'User Not Found' };
        }
        return user;
    }

    /**
     * Validate the password of user
     * @param email 
     * Email of User
     * @param password
     * Password of User 
     * @returns 
     * True or False
     */
    async validatePassword(email: string, password: string) {
        const user = await this.userService.getUserByEmail(email)
        const isValid = await bcrypt.compare(password, user.password);
        console.log(isValid)
        if (isValid) {
            return true;
        }
        return false
    }

    /**
     * Return the access token if user is validated
     * @param user 
     * Login user
     * @returns 
     * access token or message
     */
    async login(user: any): Promise<any> {
        if (user.message) {
            return user;
        }
        const username = user.username
        const id = user.id
        const user_type = user.user_type
        const jwtToken = this.jwtService.sign({username, id, user_type});
        // await this.createOrUpdateSession(jwtToken, user);

        return {
            access_token: jwtToken,
        };
    }

    /**
     * Get user by id
     * @param id 
     * Id of user
     * @returns 
     * User
     */
    async getUserById(id: number): Promise<User> {
        const user = await this.userService.getUserById(id);
        console.log(user)
        if (user) {
            return user;
        }
        return null;
    }

    /**
     * Change user password
     * @param body 
     * Change Password Dto
     * @param user 
     * Caller of api
     * @returns 
     */
    async changePassword(body: ChangePasswordDTO, user) {
        const isValid = await this.validatePassword(user.email, body.old_password)
        if (isValid) {
            const hash = await bcrypt.hash(body.new_password, 10);
            const newUser = this.userService.updatePassword(user.id, hash);
            return newUser;
        }
        return false
    }
}
