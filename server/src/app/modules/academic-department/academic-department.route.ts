import { Router } from 'express';
import { AcademicDepartmentController } from './academic-department.controller';
import validateRequest from '../../utils/validateRequest';
import { AcademicDepartmentValidation } from './academic-department.validation';

const router = Router();

router.get('/', AcademicDepartmentController.getAllAcademicDepartments);
router.get(
  '/:departmentId',
  AcademicDepartmentController.getSingleAcademicDepartment,
);
router.post(
  '/create-department',
  validateRequest(
    AcademicDepartmentValidation.createAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentController.createAcademicDepartmemt,
);
router.patch(
  '/:departmentId',
  validateRequest(
    AcademicDepartmentValidation.updateAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentController.updateAcademicDeartment,
);

export const AcadmicDepartmentRoutes = router;
