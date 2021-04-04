import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'pweb',
    password: 'pwebbddgrp7',
    database: 'pwebaudio',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
};