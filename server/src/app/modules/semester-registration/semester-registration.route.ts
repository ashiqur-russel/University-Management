import express from 'express';
import validateRequest from '../../utils/validateRequest';
import { SemesterRegistrationValidations } from './semester-registration.validaton';
import { SemesterRegistrationController } from './semester-registration.controller';
import AuthGuard from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-semester-registration',
  AuthGuard(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.createSemesterRegistration,
);

router.get(
  '/:id',
  AuthGuard(USER_ROLE.admin, USER_ROLE.superAdmin),
  SemesterRegistrationController.getSingleSemesterRegistration,
);

router.patch(
  '/:id',
  AuthGuard(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    SemesterRegistrationValidations.upadateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.updateSemesterRegistration,
);

router.get(
  '/:id',
  AuthGuard(USER_ROLE.admin, USER_ROLE.superAdmin),
  SemesterRegistrationController.getSingleSemesterRegistration,
);

router.delete(
  '/:id',
  AuthGuard(USER_ROLE.admin, USER_ROLE.superAdmin),
  SemesterRegistrationController.deleteSemesterRegistration,
);

router.get(
  '/',
  AuthGuard(USER_ROLE.admin, USER_ROLE.superAdmin),
  SemesterRegistrationController.getAllSemesterRegistrations,
);

export const semesterRegistrationRoutes = router;
