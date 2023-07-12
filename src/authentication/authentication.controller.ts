import { Body, Controller, HttpStatus, Post, Res, Req, UseGuards, Get, Param, Delete, UseInterceptors, UploadedFile, ParseIntPipe } from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';

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

    if (!user) {
      res.status(HttpStatus.BAD_REQUEST).send({ message: "user not valid" })
    }
    return res.status(HttpStatus.OK).send({ user })
  }

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
}
