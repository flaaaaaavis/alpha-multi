import config from './config.js';
import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE,
    host: config.DB_HOST,
    port: config.DB_PORT
});