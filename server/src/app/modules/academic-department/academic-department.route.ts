import { Router } from 'express';
import { AcademicDpartmentController } from './academic-department.controller';
import validateRequest from '../../utils/validateRequest';
import { AcademicDepartmentValidation } from './academic-department.validation';

const router = Router();

router.get('/', AcademicDpartmentController.findAll);
router.post(
  '/create-department',
  validateRequest(
    AcademicDepartmentValidation.createAcademicDepartmentValidationSchema,
  ),
  AcademicDpartmentController.createAcademicDepartmemt,
);

export const AcadmicDepartmentRoutes = router;
