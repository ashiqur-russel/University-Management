import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import { string } from 'zod';
import AppError from '../errors/appError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const AuthGuard = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw new AppError('Unauthorized', httpStatus.UNAUTHORIZED);
    }

    const decodedToken = jwt.verify(
      authorizationHeader,
      config.jwt_secret as string,
    ) as JwtPayload;

    const { userId, role } = decodedToken;

    // checking if the user is exist
    const user = await User.isUserExistsByCustomId(userId);

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
      throw new AppError('This user is blocked ! !', httpStatus.FORBIDDEN);
    }

    if (requiredRoles && requiredRoles.includes(role)) {
      next();
    } else {
      throw new AppError(
        'You are not authorized to access!',
        httpStatus.UNAUTHORIZED,
      );
    }
  });
};

export default AuthGuard;
