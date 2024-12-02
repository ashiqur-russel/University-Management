import { Router } from 'express';
import { AcademicSemesterController } from './academic-semester.controller';

const router = Router();

router.post(
  '/create-semester',
  AcademicSemesterController.createAcademicSemester,
);

export default router;
