import { UserService } from './user.service';
import sendResponse from '../../utils/response';
import catchAsync from '../../utils/catchAsync';

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

const createFaculty = catchAsync(async (req, res) => {
  const { faculty: facultyData, password } = req.body;

  const result = await UserService.createFaculty(facultyData, password);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    data: result,
    message: 'Faculty Created Successfully',
  });
});

export const UserController = {
  createStudent,
  createFaculty,
};
