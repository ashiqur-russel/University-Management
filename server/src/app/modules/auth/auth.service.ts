import AppError from '../../errors/appError';
import { Admin } from '../admin/admin.model';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import config from '../../config';
import jwt, { JwtPayload } from 'jsonwebtoken';

const loginUser = async (payload: TLoginUser) => {
  const { id, password } = payload;

  const user = await User.isUserExistsByCustomId(id);

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
    const jwtPayload = { userId: user.id, role: user.role };

    const accessToken = jwt.sign(jwtPayload, config.jwt_secret as string, {
      expiresIn: '24h',
    });
    return { accessToken, needsPasswordChange: user?.needsPasswordChange };
  } else {
    throw new AppError('Wrong password!', httpStatus.FORBIDDEN);
  }
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {};

export const AuthServices = { loginUser, changePassword };
