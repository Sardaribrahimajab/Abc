import { Body, Controller, HttpStatus, HttpException,Post, Res, Put, Param, Get, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/authentication/jwt-auth.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enum/role.enum';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){ }

    @Roles(Role.SUPER_ADMIN)
    @UseGuards(JwtAuthGuard)
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
    @Get(':id')
    getuser(@Param('id') id: string){
        return 'hi'+ id
    }
    @Get()
    getalluser(){
        return 'hi all'
    }
    @Delete(':id')
    deleteUser(@Param('id') id: string){
        
    }
}
