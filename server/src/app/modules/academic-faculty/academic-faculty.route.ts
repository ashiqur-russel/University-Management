import { Router } from 'express';
import { academicFacultyController } from './academic-faculty.controller';
import validateRequest from '../../utils/validateRequest';
import { AcademicFacultyValidation } from './academic-faculty.validation';
import AuthGuard from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.get(
  '/',
  AuthGuard(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.superAdmin),
  academicFacultyController.getAllAcademicFaculties,
);
router.get(
  '/:facultyId',
  AuthGuard(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.superAdmin),
  academicFacultyController.getSingleAcademicFaculty,
);

router.post(
  '/create-academic-faculty',
  AuthGuard(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(AcademicFacultyValidation.academicFacultyValidationSchema),
  academicFacultyController.createAcademicFaculty,
);

router.patch(
  '/:facultyId',
  AuthGuard(USER_ROLE.admin),
  validateRequest(
    AcademicFacultyValidation.updateAcademicFacultyValidationSchema,
  ),
  academicFacultyController.updateAcademicFaculty,
);

export const AcademicFacultyRoutes = router;
