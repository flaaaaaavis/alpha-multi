import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  BD_URL: process.env.BD_URL,
  API_KEY: process.env.API_KEY
};

export default config;
