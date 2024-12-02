import { Router } from 'express';
import { AcademicSemesterController } from './academic-semester.controller';
import validateRequest from '../../utils/validateRequest';
import { AcademicSemesterValidations } from './academic-semester.validation';

const router = Router();

router.post(
  '/create-semester',
  validateRequest(
    AcademicSemesterValidations.createAcdemicSemesterValidationSchema,
  ),
  AcademicSemesterController.createAcademicSemester,
);

export const AcademicSemesterRoutes = router;
