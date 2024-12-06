import { Request, Response } from 'express';
import { AcademicDpartmentService } from './academic-department.service';
import sendResponse from '../../utils/response';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
const findAll = async (req: Request, res: Response) => {
  const data = await AcademicDpartmentService.findAll();
  res.json(data);
};

const createAcademicDepartmemt = catchAsync(async (req, res) => {
  const result = await AcademicDpartmentService.createAcademicDepartment(
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic department is created succesfully',
    data: result,
  });
});

export const AcademicDpartmentController = {
  findAll,
  createAcademicDepartmemt,
};
