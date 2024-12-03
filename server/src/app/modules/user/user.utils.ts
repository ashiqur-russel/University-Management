import bcrypt from 'bcrypt';
import config from '../../config';

export const generateHashedPassword = async (
  password: string,
): Promise<string> => {
  const hashPassword = await bcrypt.hash(password, Number(config.bcrypt_salt));
  return hashPassword;
};
