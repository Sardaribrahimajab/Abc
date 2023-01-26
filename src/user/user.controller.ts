import { Body, Controller, HttpStatus, HttpException,Post, Res, Put, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){ }


    @Post()
    async signUp(@Body() body: CreateUserDto, @Res() res: Response) {
        const user: any = await this.userService.createUser(body);
        if (user.id) {
        return res.status(HttpStatus.CREATED).send(user);
        }
        else {
        return res.status(HttpStatus.BAD_REQUEST).send({ "message": user });
        }
    }
    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() body: CreateUserDto, @Res() res: Response) {
        const user: any = await this.userService.updateUser(parseInt(id),body);
        if (user) {
            return res.status(HttpStatus.OK).send(user);
        }
        else {
        return res.status(HttpStatus.BAD_REQUEST).send({ "message": user });
        }
    }
}
