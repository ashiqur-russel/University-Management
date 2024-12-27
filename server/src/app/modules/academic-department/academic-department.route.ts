import { Router } from 'express';
import { AcademicDepartmentController } from './academic-department.controller';
import validateRequest from '../../utils/validateRequest';
import { AcademicDepartmentValidation } from './academic-department.validation';
import AuthGuard from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.get(
  '/',
  AuthGuard(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.superAdmin),
  AcademicDepartmentController.getAllAcademicDepartments,
);
router.get(
  '/:departmentId',
  AuthGuard(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.superAdmin),
  AcademicDepartmentController.getSingleAcademicDepartment,
);
router.post(
  '/  ',
  AuthGuard(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.superAdmin),

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
