import AppError from '../../errors/appError';
import { Admin } from '../admin/admin.model';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import config from '../../config';

const loginUser = async (payload: TLoginUser) => {
  const { id, password } = payload;

  const user =  await User.isUserExistsByCustomId(id)

  if (!user) {
    throw new AppError('User not found!', httpStatus.NOT_FOUND);
  }

  if (await User.isUserDeleted(id)) {
    throw new AppError(
      'This user is deleted! Please contact with admin!',
      httpStatus.NOT_FOUND,
    );
  }

  if ((await User.isUserBlocked(id)) === 'blocked') {
    throw new AppError(
      'Your profile is blocked! Please contact with admin!',
      httpStatus.NOT_FOUND,
    );
  }

    if (await User.isPasswordMatched(password, user.password)) {
      return user;
    } else {
      throw new AppError('Wrong password!', httpStatus.FORBIDDEN);
    }
};
export const AuthServices = { loginUser };
