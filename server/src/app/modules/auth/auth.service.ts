import AppError from '../../errors/appError';
import { Admin } from '../admin/admin.model';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import config from '../../config';

const loginUser = async (payload: TLoginUser) => {
  const { id, password } = payload;

  const user = await User.findOne({ id });

  if (!user) {
    throw new AppError('User not found!', httpStatus.NOT_FOUND);
  }

  const isUserDeleted = user.isDeleted;

  if (isUserDeleted) {
    throw new AppError(
      'This user is deleted! Please contact with admin!',
      httpStatus.NOT_FOUND,
    );
  }

  const isUserBlocked = user.status;

  if (isUserBlocked === 'blocked') {
    throw new AppError(
      'Your profile is blocked! Please contact with admin!',
      httpStatus.NOT_FOUND,
    );
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (isPasswordMatched) {
    return user;
  } else {
    throw new AppError('Wrong password!', httpStatus.BAD_REQUEST);
  }
};
export const AuthServices = { loginUser };
