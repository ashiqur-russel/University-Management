import { NextFunction, Request, RequestHandler, Response } from 'express';
import { UserService } from './user.service';
import sendResponse from '../../utils/response';

const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => next(error));
  };
};

const createStudent = catchAsync(async (req, res) => {
  const { student: studentData, password } = req.body;

  const result = await UserService.createStudent(studentData, password);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    data: result,
    message: 'Student Created Successfully',
  });
});

export const UserController = {
  createStudent,
};
