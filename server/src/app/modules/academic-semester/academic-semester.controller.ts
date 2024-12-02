import { AcademicSemesterService } from './academic-semester.service';
import sendResponse from '../../utils/response';
import catchAsync from '../../utils/catchAsync';

const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterService.createAcademicSemester(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    data: result,
    message: 'Academic Semester Created Successfully',
  });
});
export const AcademicSemesterController = { createAcademicSemester };
