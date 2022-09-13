import pkg from 'pg';
const { Pool } = pkg;
import config from './config.js';

export const pool = new Pool({
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE,
    host: config.DB_HOST,
    port: config.DB_PORT
});