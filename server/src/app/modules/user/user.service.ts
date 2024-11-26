import { TUser } from './user.interface';
import { User } from './user.model';

const createStudent = async (userData: TUser): Promise<TUser> => {
  return await User.create(userData);
};

export const UserService = {
  createStudent,
};
