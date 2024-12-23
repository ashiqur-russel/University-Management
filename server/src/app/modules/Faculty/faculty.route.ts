import express from 'express';
import { FacultyControllers } from './faculty.controller';
import { updateFacultyValidationSchema } from './faculty.validation';
import validateRequest from '../../utils/validateRequest';
import AuthGuard from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get(
  '/:id',
  AuthGuard(USER_ROLE.admin),
  FacultyControllers.getSingleFaculty,
);

router.patch(
  '/:id',
  AuthGuard(USER_ROLE.admin),
  validateRequest(updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);

router.delete(
  '/:id',
  AuthGuard(USER_ROLE.admin),
  FacultyControllers.deleteFaculty,
);

router.get(
  '/',
  AuthGuard(USER_ROLE.admin, USER_ROLE.faculty),
  FacultyControllers.getAllFaculties,
);

export const FacultyRoutes = router;
