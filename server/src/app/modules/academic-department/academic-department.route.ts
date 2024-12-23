import { Router } from 'express';
import { AcademicDepartmentController } from './academic-department.controller';
import validateRequest from '../../utils/validateRequest';
import { AcademicDepartmentValidation } from './academic-department.validation';
import AuthGuard from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.get('/', AcademicDepartmentController.getAllAcademicDepartments);
router.get(
  '/:departmentId',
  AcademicDepartmentController.getSingleAcademicDepartment,
);
router.post(
  '/create-academic-department',
  AuthGuard(USER_ROLE.admin),

  validateRequest(
    AcademicDepartmentValidation.createAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentController.createAcademicDepartmemt,
);
router.patch(
  '/:departmentId',
  AuthGuard(USER_ROLE.admin),

  validateRequest(
    AcademicDepartmentValidation.updateAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentController.updateAcademicDeartment,
);

export const AcadmicDepartmentRoutes = router;
