import { Router } from 'express';
import { AcademicSemesterController } from './academic-semester.controller';
import validateRequest from '../../utils/validateRequest';
import { AcademicSemesterValidations } from './academic-semester.validation';
import AuthGuard from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/create-semester',
  AuthGuard(USER_ROLE.admin),
  validateRequest(
    AcademicSemesterValidations.createAcdemicSemesterValidationSchema,
  ),
  AcademicSemesterController.createAcademicSemester,
);

export const AcademicSemesterRoutes = router;
