import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationService } from './authentication.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { AuthenticationController } from './authentication.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { Expiration_Time_JWT } from 'src/utils/envirmentvariable';
import { User } from '../user/entity/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: Expiration_Time_JWT },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [ AuthenticationController],
  providers: [AuthenticationService, JwtStrategy, LocalStrategy, UserService],
  exports: [AuthenticationService]
})
export class AuthenticationModule {}
