import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_secret_expires: process.env.JWT_ACCESS_EXPIRATION,
  jwt_refresh_secret_expires: process.env.JWT_REFRESH_EXPIRATION,
  environment: process.env.NODE_ENV,
  bcrypt_salt_rounds: process.env.SALT,
  default_pass: process.env.DEFAULT_PASS,
  email_sender: process.env.EMAIL_SENDER,
  email_pass: process.env.EMAIL_APP_PASSWORD,
  reset_password_ui_link: process.env.RESET_PASS_UI_LINK,
};
