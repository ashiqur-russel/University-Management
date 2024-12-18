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
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(userData.userId);

  if (!user) {
    throw new AppError('This user is not found !', httpStatus.NOT_FOUND);
  }

  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError('This user is deleted !', httpStatus.FORBIDDEN);
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError('This user is blocked !', httpStatus.FORBIDDEN);
  }

  //checking if the password is correct
  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
    throw new AppError('Password do not matched', httpStatus.FORBIDDEN);

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    { id: userData.userId, role: userData.role },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
};

export const AuthServices = { loginUser, changePassword };
