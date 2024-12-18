import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/response';
import { AuthServices } from './auth.service';
import httpStatus from 'http-status';

const loginUser = catchAsync(async (req, res) => {
  console.log(req.body);
  const result = await AuthServices.loginUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in succesfully!',
    data: { result },
  });
});

export const AuthControllers = {
  loginUser,
};
