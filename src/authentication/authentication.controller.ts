import { Body, Controller, HttpStatus, Post, Res, Req, UseGuards, Get, Param, Delete, UseInterceptors, UploadedFile, ParseIntPipe } from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { jwtConstants } from './constants';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { DeleteUserDTO } from './dto/delete-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from '../user/user.service';
// import { ADMIN_APP_LINK, CUSTOMER_APP_LINK } from '../utils/environmentVariable';
import { CreateUserDto } from '../user/dto/create-user.dto';
// import { Role } from '../enum/role.enum';
// import { Roles } from '../decorator/roles.decorator';
import { storage } from '../utils/utils';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { EmailDto } from './dto/email.dto';
import { ProfilePicKeyDto } from './dto/profile-pic-key.dto';
import { JwtTokenDto } from './dto/jwt-token.dto';

/**
 * Authentication Controller to serve authentication related operations
 */
@Controller('/auth/user')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  /**
   * Signup for user
   * @param body 
   * Create User Dto
   * @param res 
   * Internal Response Obj
   * @returns 
   * 200 on success and 400 on failure
   */
  @Post('/signup')
  async signUp(@Body() body: CreateUserDto, @Res() res: Response) {
    const user: any = await this.authService.createUser(body);
    if (user.id) {
      return res.status(HttpStatus.CREATED).send(user);
    }
    else {
      res.status(HttpStatus.BAD_REQUEST).send({ "message": user });
    }
  }

  /**
   * Create a user without sending an sms to user mobile number. 
   * Instead send a reset password link to user email to reset the password. 
   * @param body 
   * Create User Dto
   * @param res 
   * Internal Response Obj
   * @returns 
   * 200 on success and 400 on failure
   */
  // @Post('/create')
  // async createUser(@Body() body: CreateUserDto, @Res() res: Response) {
  //   const user = await this.authService.createUserWithoutSendingSMS(body);
  //   if (user.id) {
  //     const secret = jwtConstants.secret + user.password;
  //     const payload = {
  //       email: user.email,
  //       id: user.id
  //     }
  //     const token = this.jwtService.sign(payload, { secret });
  //     let link = ""
  //     if (user.user_type === Role.SUPER_ADMIN || user.user_type === Role.AGENCY_ADMIN) {
  //       link = `${ADMIN_APP_LINK}/auth/reset-password/${token}`
  //     }
  //     else {
  //       link = `${CUSTOMER_APP_LINK}/home/reset-password/${token}`
  //     }
  //     await this.authService.forgetPassword(user.email, link);
  //     user.is_active = true;
  //     await this.userService.saveUser(user);
  //     const returnedUser = await this.userService.updateUserField(user.email, "otp", token);
  //     return res.status(HttpStatus.OK).json({ user: returnedUser });
  //   }
  //   else {
  //     res.status(HttpStatus.BAD_REQUEST).send({ "message": user });
  //   }
  // }

  /**
   * Signin for user
   * @param req 
   * Internal Request Obj
   * @param res 
   * Internal Response Obj
   * @returns 
   * 200 and jwt token on success and 400 failure
   */
  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  async login(@Req() req, @Res() res) {
    if (req?.user?.message) {
      return res.status(HttpStatus.BAD_REQUEST).json(req.user).send();
    }
    const jwt = await this.authService.login(req.user);
    // await this.authService.createLoginAction(req.user)
    return res.status(HttpStatus.OK).json(jwt);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('/signout')
  // async signOut(@Req() req) {
  //   await this.authService.logOut(req.user);
  // }

  /**
   * Get Profile of user
   * @param req 
   * Internal Request Obj
   * @param res 
   * Internal Response Obj
   * @returns 
   * 200 and user object on success and 401 on failure
   */
  // @Roles(Role.SUPER_ADMIN, Role.OWNER, Role.AGENCY_ADMIN, Role.AGENT)
  // @UseGuards(JwtAuthGuard)
  // @Get('/profile')
  // getProfile(@Req() req, @Res() res) {
  //   return res.status(HttpStatus.OK).json(req.user);
  // }

  /**
   * Verify the OTP
   * @param body 
   * Verify OTP Dto
   * @param res 
   * Internal Response Obj
   * @returns 
   * 200 on success and 400 on failure
   */
  // @Post('/verify')
  // async verify_otp(@Body() body: verifyOtpDto, @Res() res) {
  //   const is_verified = await this.authService.verifyOTP(body);
  //   if (is_verified) {
  //     return res.status(HttpStatus.OK).json({ 'message': 'Successfully verified', is_verified });
  //   }
  //   return res.status(HttpStatus.BAD_REQUEST).json({ 'message': 'Verification is failed' });
  // }

  /**
   * Help user to recover its password and send a reset password link email
   * @param body 
   * Email Dto
   * @param res
   * Internal Response Obj 
   * @param req 
   * Internal Request Obj
   * @returns 
   * 200 on success and 404 on failure
   */
  // @Post("/forget_password")
  // async forgetPassword(@Body() body: EmailDto, @Res() res, @Req() req) {
  //   const user = await this.userService.getUserByEmail(body.email);
  //   if (!user) {
  //     return res.status(HttpStatus.NOT_FOUND).json({ 'message': "user not found" });
  //   }
  //   const secret = jwtConstants.secret + user.password;
  //   const payload = {
  //     email: user.email,
  //     id: user.id
  //   }
  //   const token = this.jwtService.sign(payload, { secret });
  //   let link = ""
  //   if (user.user_type === Role.SUPER_ADMIN || user.user_type === Role.AGENCY_ADMIN) {
  //     link = `${ADMIN_APP_LINK}/auth/reset-password/${token}`
  //   }
  //   else {
  //     link = `${CUSTOMER_APP_LINK}/home/reset-password/${token}`
  //   }
  //   await this.authService.forgetPassword(user.email, link)
  //   const returnedUser = await this.userService.updateUserField(user.email, "otp", token)
  //   return res.status(HttpStatus.OK).json({ 'link': link, user: returnedUser });
  // }

  /**
   * Validate the tokan and reset the user password
   * @param body 
   * Jwt Token Dto
   * @param res 
   * Internal Response Obj
   * @returns 
   * 200 on success and 404 or 401 on failure
   */
  // @Post("/reset_password")
  // async resetPassword(@Body() body: JwtTokenDto, @Res() res) {
  //   const payload = this.jwtService.decode(body.token)
  //   if (!payload["email"]) {
  //     return res.status(HttpStatus.BAD_REQUEST).send()
  //   }
  //   const user = await this.userService.getUserByEmail(payload["email"]);
  //   if (!user)
  //     return res.status(HttpStatus.NOT_FOUND).json({ 'message': "user not found" });
  //   if (user.otp !== body.token)
  //     return res.status(HttpStatus.UNAUTHORIZED).send();
  //   await this.userService.updateUserField(user.email, "otp", "");
  //   const hash = await bcrypt.hash(body.password, 10);
  //   const response = await this.userService.updateUserField(user.email, "password", hash);
  //   return res.status(HttpStatus.OK).send({ user: response });
  // }

  /**
   * Help User to change its password
   * @param body 
   * Change Password Dto
   * @param res 
   * Internal Response Obj
   * @param req 
   * Internal Request Obj
   * @returns 
   * 200 on success and 400 on failure
   */
  // @UseGuards(JwtAuthGuard)
  // @Post("/change-password")
  // async changePassword(@Body() body: ChangePasswordDTO, @Res() res, @Req() req) {
  //   const user = await this.authService.changePassword(body, req.user)
  //   if (!user) {
  //     res.status(HttpStatus.BAD_REQUEST).send({ message: "old password is incorrect" });
  //   }
  //   return res.status(HttpStatus.OK).send({ user })
  // }

  /**
   * Help to update the user information
   * @param body 
   * Update User Dto
   * @param res 
   * Internal Response Obj
   * @param req 
   * Internal Request Obj
   * @returns 
   * 200 on success and 400 on failure
   */
  @Post("/update-user")
  @UseGuards(JwtAuthGuard)
  async updateUser(@Body() body: UpdateUserDto, @Res() res, @Req() req) {
    let user = null;
    // if ((req.user.user_type === Role.SUPER_ADMIN) && body.id) {
    //   user = await this.userService.updateUser(body.id, body);
    // }
    // else {
    //   user = await this.userService.updateUser(req.user.id, body);
    // }

    if (!user) {
      res.status(HttpStatus.BAD_REQUEST).send({ message: "user not valid" })
    }
    return res.status(HttpStatus.OK).send({ user })
  }

  /**
   * Soft Delete the user
   * @param body 
   * Delete User Dto
   * @param res 
   * Internal Response Obj
   * @param req 
   * Internal Request Obj
   * @returns 
   * 200 on success and 400 failure
   */
  // @UseGuards(JwtAuthGuard)
  // @Delete("/delete-user")
  // async deleteUser(@Body() body: DeleteUserDTO, @Res() res, @Req() req) {
  //   const {statusCode, ...message} = await this.userService.deleteUser(req.user, body);
  //   return res.status(statusCode).send(message);
  // }

  /**
   * Get Login history of logged in user
   * @param req 
   * Internal Request Obj
   * @returns 
   * 200 on success and user data
   */
  // @Get('/get-login-history')
  // @UseGuards(JwtAuthGuard)
  // async getLoginHistory(@Req() req) {
  //   return this.authService.getLoginHistory(req.user);
  // }

  /**
   * Get login history of any user by its id
   * @param id 
   * Id of the user
   * @returns 
   * 200 on success and user data
   */
  // @Get('/get-login-history/:id')
  // async getLoginHistoryOfAUser(@Param('id', ParseIntPipe) id: number) {
  //   return await this.authService.getLoginHistoryOfAUser(id);

  // }

  /**
   * Get User by its id
   * @param id 
   * Id of the user
   * @returns 
   * 200 on success and user data
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getUserById(id);
  }
  
  /**
   * update the user profile picture
   * @param req 
   * Internal Request Obj
   * @param body 
   * Profile Picture Key Dto
   * @returns 
   * 200 on success and user data
   */
  // @Post("/profile-pic")
  // @UseGuards(JwtAuthGuard)
  // async updateProfilePic(@Req() req, @Body() body: ProfilePicKeyDto) {
  //   return await this.userService.updateProfilePic(req.user, body);
  // }

  /**
   * Help to resend the OTP on user mobile number
   * @param body 
   * Email Dto
   * @param res
   * Internal Response Obj 
   * @returns 
   * 200 on success and 400 on failure
   */
  // @Post('/resend-otp')
  // async resendOTP(@Body() body: EmailDto, @Res() res) {
  //   const { statusCode, ...result } = await this.authService.resendOTPCode(body.email);
  //   return res.status(statusCode).json(result);
  // }
}
