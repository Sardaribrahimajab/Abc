import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expiration_Time_JWT } from 'src/utils/envirmentvariable';
import { UserService } from '../user/user.service';
// import { SendgridService } from '../sendgrid.service';
// import { AgencyService } from '../agency/agency.service';
// import { ACL } from '../admin/entity/acl.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Role } from '../enum/role.enum';
import { User } from '../user/entity/user.entity';
// import { verifyOtpDto } from '../user/dto/verify-otp.dto';
// import { WebconfigService } from '../webconfig/webconfig.service';
import moment from 'moment';

dotenv.config();

// const client = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// sgMail.setApiKey(SEND_GRID_KEY)

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

        // await this.verificationService.getVerificationText(savedUser)

        // if ((savedUser.user_type as string).toLowerCase() === Role.AGENCY_ADMIN) {
        //     await this.agencyService.createAgencyProfileWithUser(savedUser);
        // }
        // if ((savedUser.user_type as string).toLowerCase() === Role.AGENT) {
        //     await this.agencyService.createAgentProfileWithUser(savedUser, createUserDto.agency_id);
        // }
        // if (!((savedUser.user_type as string).toLowerCase() === Role.OWNER)) {
        //     const acl = this.aclRepo.create({ is_home: true });
        //     acl.user = savedUser;
        //     await this.aclRepo.save(acl);
        // }
        return savedUser;
    }

    /**
     * Create user without sending otp to its mobile number
     * @param createUserDto 
     * Create User Dto
     * @returns 
     * Saved User
     */
    // async createUserWithoutSendingSMS(createUserDto: CreateUserDto): Promise<any> {
    //     const user = await this.userService.getUserByEmail(createUserDto.email)
    //     if (user) {
    //         return { "message": "email already exists" }
    //     }
    //     const hash = await bcrypt.hash('JutherDefault@321', 10);
    //     const rand = Array.from(Array(6), () => Math.floor(Math.random() * 36).toString(36)).join('');
    //     createUserDto.password = hash;

    //     const savedUser = await this.userService.createUser(createUserDto, rand);
    //     if ((savedUser.user_type as string).toLowerCase() === Role.AGENT) {
    //         await this.agencyService.createAgentProfileWithUser(savedUser, createUserDto.agency_id);
    //     }
    //     if (!((savedUser.user_type as string).toLowerCase() === Role.OWNER)) {
    //         const acl = this.aclRepo.create({ is_home: true });
    //         acl.user = savedUser;
    //         await this.aclRepo.save(acl);
    //     }
    //     return savedUser;
    // }

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
        // if (user && !user.is_admin_approved && user.user_type === Role.AGENT) {
        //     return { 'message': 'Waiting For Agency Admin Approval. Thank you' };
        // }
        // if (user && !user.is_admin_approved) {
        //     return { 'message': 'Waiting For Admin Approval. Thank you.' };
        // }
        // if (user && user.is_active) {
        //     const isValid = await bcrypt.compare(password, user.password);
        //     if (isValid && user.is_active) {
                return user;
        //     }
        // }
        // else {
        //     try {
        //         const data = await this.verificationService.getVerificationText(user)
        //         if (data) {
        //             console.log(data);
        //             const result = await this.cleanUserObject(user);
        //             return { message: "code sent for verification - user not verified", verified: false, user: result };
        //         }
        //     } catch (e) {
        //         console.log(e);
        //         return e;
        //     }
        // }
        return null;
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

    // async logOut(user: any) {
    //     const isSessionAvailable = await this.sessionRepo.findOne({
    //         where: {
    //             userId: user.id
    //         }
    //     });
    //     if (isSessionAvailable) {
    //         await this.sessionRepo.update(isSessionAvailable.id, {
    //             token: "",
    //             expired_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    //         });
    //     }

    // }

    // async createOrUpdateSession(jwtToken: string, user: User) {
    //     const expiry = +Expiration_Time_JWT.substring(0, Expiration_Time_JWT.length - 1);
    //     const isSessionAvailable = await this.sessionRepo.findOne({
    //         where: {
    //             userId: user.id
    //         }
    //     });

    //     if (isSessionAvailable) {
    //         await this.sessionRepo.update(isSessionAvailable.id, {
    //             token: jwtToken,
    //             expired_at: moment().add(expiry, 'seconds').format("YYYY-MM-DD HH:mm:ss"),
    //         });
    //     } else {
    //         const session = this.sessionRepo.create({
    //             token: jwtToken,
    //             expired_at: moment().add(expiry, 'seconds').format("YYYY-MM-DD HH:mm:ss"),
    //             userId: user.id
    //         });
    //         await this.sessionRepo.save(session);
    //     }
    // }

    /**
     * Verify OTP of user
     * @param verifyOtpDto 
     * Verifty Otp Dto
     * @returns 
     * access token or false
     */
    // async verifyOTP(verifyOtpDto: verifyOtpDto) {
    //     let user = await this.userService.getUserWithACL(verifyOtpDto.email);
    //     const data = await this.verificationService.Verify(user.id, verifyOtpDto.otp);
    //     if (data) {
    //         // if (data.status === "accepted") {
    //         user.is_active = true;
    //         await this.userService.saveUser(user);
    //         let result = await this.cleanUserObject(user);
    //         if (user.user_type === Role.AGENT) {
    //             return {
    //                 access_token: ''
    //             };
    //         }
    //         const jwtToken = this.jwtService.sign(result);
    //         await this.createOrUpdateSession(jwtToken, user);
    //         return {
    //             access_token: jwtToken,
    //         };
    //     }
    //     else {
    //         return false;
    //     }
    //     // }
    //     // return false;
    // }

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

    // async isSessionValid(token: string) {
    //     const session = await this.sessionRepo.findOne({
    //         where: {
    //             token
    //         }
    //     });

    //     if (session) {
    //         if (moment(session.expired_at) > moment())
    //             return true;
    //         else
    //             return false;
    //     }
    //     return false;
    // }

    /**
     * Send an email to user for password resetting
     * @param email 
     * Email of User
     * @param link 
     * Reset Password Link
     */
    // async forgetPassword(email: string, link: string) {
    //     await this.sendgridService.sendEmail(email, link)
    // }

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

    /**
     * Clean the user object and Adjust its claims
     * @param user 
     * User object
     * @returns 
     * Cleaned User object
     */
    // async cleanUserObject(user: User) {
    //     const result = { ...user, password: '' };
    //     delete result.password;
    //     if (result.otp) {
    //         delete result.otp;
    //     }
    //     const is_package = await this.webService.getIsPackageEnabled();
    //     const newResult: any = result;
    //     newResult.claims = [];
    //     if (result.user_type === Role.AGENCY_ADMIN) {
    //         newResult.claims.push(
    //             'home', 'listings', 'agents',
    //             'messages', 'projects',
    //             'rolesnpermissions'
    //         );
    //     } else if (result.user_type === Role.AGENT) {
    //         Object.keys(result.acl).map(key => {
    //             if (!(key === 'is_statistics' ||
    //                 key === 'is_rolesnpermissions' ||
    //                 key === 'is_settings' ||
    //                 key === 'is_packages' ||
    //                 key === 'is_payments' ||
    //                 key === 'is_blogs')) {
    //                 if (result.acl[key] === true) {
    //                     newResult.claims.push(key.slice(3));
    //                 }
    //             }
    //         });
    //     } else if (result.user_type === Role.SUPER_ADMIN) {
    //         Object.keys(result.acl).map(key => {
    //             if (key === 'is_packages') {
    //                 // if packaging off then remove packages from claims
    //                 if (is_package.is_package_enabled && result.acl[key] === true) {
    //                     newResult.claims.push(key.slice(3));
    //                 }
    //             } else {
    //                 if (result.acl[key] === true) {
    //                     newResult.claims.push(key.slice(3));
    //                 }
    //             }

    //         });
    //     }
    //     if (newResult.acl) {
    //         delete newResult.acl;
    //     }
    //     newResult['is_package'] = is_package.is_package_enabled;
    //     return newResult;
    // }

    /**
     * Create the login history for user
     * @param user 
     * User which is logged in
     */
    // async createLoginAction(user: User) {
    //     const loginObj = this.loginRepo.create({
    //         user: user
    //     });
    //     await this.loginRepo.save(loginObj);
    // }

    /**
     * Get login history of logged in user
     * @param user 
     * caller of api
     * @returns 
     * Login history data
     */
    // async getLoginHistory(user: User) {
    //     return await this.loginRepo.find({
    //         where: { user: { id: user.id } },
    //         select: ['id', 'action', 'created_at']
    //     });
    // }

    /**
     * Get login history of any user
     * @param id 
     * Id of user
     * @returns 
     * Login history data
     */
    // async getLoginHistoryOfAUser(id: number) {
    //     return await this.loginRepo.find({
    //         where: { user: { id: id } },
    //         select: ['id', 'action', 'created_at']
    //     });
    // }

    /**
     * Resend the OTP code
     * @param email 
     * Email of user
     * @returns 
     * 200 on success and 400 on failure
     */
    // async resendOTPCode(email: string) {
    //     const user = await this.userService.getUserWithACL(email);
    //     if (!user) {
    //         return { statusCode: HttpStatus.BAD_REQUEST, message: 'User Not Found' };
    //     }
    //     if (user && !user.is_admin_approved && user.user_type === Role.AGENT) {
    //         return { statusCode: HttpStatus.BAD_REQUEST, message: 'Waiting For Agency Admin Approval. Thank you' };
    //     }
    //     if (user && !user.is_admin_approved) {
    //         return { statusCode: HttpStatus.BAD_REQUEST, message: 'Waiting For Admin Approval. Thank you.' };
    //     }
    //     const data = await this.verificationService.getVerificationText(user);
    //     if (data) {
    //         return { statusCode: HttpStatus.OK, message: "code sent for verification" };
    //     }
    //     return { statusCode: HttpStatus.BAD_REQUEST, message: "code sent for verification" };
    // }
}
