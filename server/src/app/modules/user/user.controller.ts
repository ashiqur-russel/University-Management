import { NextFunction, Request, Response } from 'express';
import { UserService } from './user.service';
import sendResponse from '../../utils/response';

const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { student: studentData, password } = req.body;

    const result = await UserService.createStudent(studentData, password);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      data: result,
      message: 'Student Created Successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  createStudent,
};
