import express from 'express';
import { UserController } from './user.controller';
import { createStudentValidationSchema } from '../student/student.validation';
import validateRequest from '../../utils/validateRequest';
import { createFacultyValidationSchema } from '../faculty/faculty.validation';
import { createAdminValidationSchema } from '../admin/admin.validation';
import AuthGuard from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { upload } from '../../utils/saveImageToCloud';
import { pasrseJsonBody } from '../../middlewares/parseJsonBody';

const router = express.Router();

router.post(
  '/create-student',
  AuthGuard(USER_ROLE.admin),
  upload.single('file'),
  pasrseJsonBody,
  validateRequest(createStudentValidationSchema),
  UserController.createStudent,
);

router.post(
  '/create-faculty',
  AuthGuard(USER_ROLE.admin),
  validateRequest(createFacultyValidationSchema),
  UserController.createFaculty,
);

router.post(
  '/create-admin',
  AuthGuard(USER_ROLE.superadmin),
  pasrseJsonBody,
  validateRequest(createAdminValidationSchema),
  UserController.createAdmin,
);

router.get(
  '/me',
  AuthGuard(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  UserController.getMe,
);

export const UserRoutes = router;
