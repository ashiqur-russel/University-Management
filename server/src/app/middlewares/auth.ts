import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import { string } from 'zod';
import AppError from '../errors/appError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';

const AuthGuard = (...requiredRoles: TUserRole[]) => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const authorizationHeader = req.headers.authorization;
    
            if (!authorizationHeader) {
                throw new AppError('Unauthorized', httpStatus.UNAUTHORIZED);
            }
    
            const token = authorizationHeader.split(' ')[1];
    
            const decodedToken = jwt.verify(token, config.jwt_secret as string) as JwtPayload; ;
    
            const { userId, role } = decodedToken;
    
            if (requiredRoles.includes(role)) {
                next();
            } else {
                throw new AppError('You are not authorized to access!', httpStatus.UNAUTHORIZED);
            }
        },
    );
};

export default AuthGuard;
