import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
const dbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'pweb',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
};

console.log(typeOrmConfig);