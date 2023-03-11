import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

import config from '../config';
export const ormconfig: DataSourceOptions = {
    type: 'postgres',
    host: config.database.dbHost,
    port: Number(config.database.dbPort),
    username: config.database.dbUser,
    password: config.database.dbPassword,
    database: config.database.dbName,
    entities: [join(__dirname, '../modules/**/*.{ts,js}')],
    migrations: [join(__dirname, 'migrations/**/*.{ts,js}')],
    migrationsTransactionMode: 'each',
    synchronize: false,
    migrationsTableName: 'migrations',
};


export default new DataSource(ormconfig);