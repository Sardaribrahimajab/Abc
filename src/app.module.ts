import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ormConfigAsyncOptions } from './config/typeorm.config';
import { AuthenticationModule } from './authentication/authentication.module';
import { CommissionModule } from './commission/commission.module';
import { BranchModule } from './branch/branch.module';
import * as cors from 'cors';

@Module({
  imports: [
    UserModule,
    //   TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'admin',
    //   password: '',
    //   database: 'new_db',
    //   entities:[],
    //   synchronize:true,
    // })
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(ormConfigAsyncOptions),
    AuthenticationModule,
    UserModule,
    CommissionModule,
    BranchModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('*');
  }
}
