import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  jwt_secret: process.env.JWT_SECRET,
  environment: process.env.NODE_ENV,
  bcrypt_salt_rounds: process.env.SALT,
  default_pass: process.env.DEFAULT_PASS,
};
