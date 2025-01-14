import { Router } from 'express';
import { AcademicSemesterController } from './academic-semester.controller';
import validateRequest from '../../utils/validateRequest';
import { AcademicSemesterValidations } from './academic-semester.validation';
import AuthGuard from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/create-academic-semester',
  AuthGuard(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    AcademicSemesterValidations.createAcdemicSemesterValidationSchema,
  ),
  AcademicSemesterController.createAcademicSemester,
);

router.get(
  '/:courseId',
  AuthGuard(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  AcademicSemesterController.getSingleAcademicSemester,
);

router.patch(
  '/:courseId',
  AuthGuard(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    AcademicSemesterValidations.updateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterController.updateAcademicSemester,
);

router.get(
  '/',
  AuthGuard(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  AcademicSemesterController.getAllAcademicSemesters,
);

export const AcademicSemesterRoutes = router;
