import express from 'express';
import { CourseControllers } from './course.controller';
import { CourseValidations } from './course.validation';
import validateRequest from '../../utils/validateRequest';
import AuthGuard from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-course',
  AuthGuard(USER_ROLE.admin),

  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);

router.patch(
  '/:id',
  AuthGuard(USER_ROLE.admin),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);

router.get('/:id', CourseControllers.getSingleCourse);

router.put(
  '/:courseId/assign-faculties',
  AuthGuard(USER_ROLE.admin),

  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesOnCourse,
);

router.delete(
  '/:courseId/remove-faculties',
  AuthGuard(USER_ROLE.admin),

  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesFromCourse,
);

router.delete(
  '/:id',
  AuthGuard(USER_ROLE.admin),
  CourseControllers.deleteCourse,
);

router.get(
  '/',
  AuthGuard(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  CourseControllers.getAllCourses,
);

export const CourseRoutes = router;
