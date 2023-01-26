import { ConfigModule, ConfigService} from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } from "../utils/envirmentvariable";

dotenv.config();

/**
 * TypeOrm Configuration
 */
export class TypeOrmConfig {
    /**
     * Get TypeOrm config options object
     * @param configService 
     * Config Service to get envs
     * @returns 
     * TypeOrm options object
     */
    public static getOrmOption(configService: ConfigService): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            timezone: 'Z',
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_NAME'),
            entities: [__dirname + '/../**/*.entity.{js,ts}'],
            synchronize: false,
        }
    } 
}

/**
 * TypeOrm Configuration used by application
 */
export const ormConfigAsyncOptions: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => TypeOrmConfig.getOrmOption(configService),
}

/**
 * TypeOrm Configuration used by migration tool
 */
const typeOrmConfigMigrate = new DataSource({
    type: 'mysql',
    host: DB_HOST,
    port: parseInt(<string>DB_PORT, 10),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: ['dist/**/*.entity.js'],
    synchronize: false,
    migrationsTableName: 'migrations',
    migrations: ['dist/**/migrations/*.js'],
    
});
export default typeOrmConfigMigrate;