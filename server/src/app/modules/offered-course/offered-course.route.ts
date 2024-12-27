import express from 'express';
import validateRequest from '../../utils/validateRequest';
import { OfferedCourseControllers } from './offered-course.controller';
import { OfferedCourseValidations } from './offered-course.validation';
import AuthGuard from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get(
  '/',
  AuthGuard(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  OfferedCourseControllers.getAllOfferedCourses,
);

router.get(
  '/my-offered-course',
  AuthGuard(USER_ROLE.student),
  OfferedCourseControllers.getMyOfferedCourses,
);

router.get(
  '/:id',
  AuthGuard(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  OfferedCourseControllers.getSingleOfferedCourses,
);

router.post(
  '/create-offered-course',
  validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse,
);

router.patch(
  '/:id',
  AuthGuard(USER_ROLE.admin, USER_ROLE.superAdmin),

  validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourse,
);

router.delete(
  '/:id',
  AuthGuard(USER_ROLE.admin, USER_ROLE.superAdmin),
  OfferedCourseControllers.deleteOfferedCourseFromDB,
);

export const offeredCourseRoutes = router;
