import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

let config;

if (process.env.DATABASE_URL) {
  // Production / Cloud configuration
  config = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  };
} else {
  // Local development configuration
  config = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'booking_app',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT || '5432'),
  };
}

const pool = new Pool(config);

pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
});

export const query = (text, params) => pool.query(text, params);
export default pool;
