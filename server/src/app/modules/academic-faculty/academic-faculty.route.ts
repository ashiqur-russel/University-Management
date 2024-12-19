import { Router } from 'express';
import { academicFacultyController } from './academic-faculty.controller';
import validateRequest from '../../utils/validateRequest';
import { AcademicFacultyValidation } from './academic-faculty.validation';
import Auth from '../../middlewares/auth';
import AuthGuard from '../../middlewares/auth';
import { Faculty } from '../faculty/faculty.model';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.get(
  '/',
  AuthGuard(USER_ROLE.admin, USER_ROLE.faculty),
  academicFacultyController.getAllAcademicFaculties,
);
router.get('/:facultyId', academicFacultyController.getSingleAcademicFaculty);

router.post(
  '/create-faculty',
  validateRequest(AcademicFacultyValidation.academicFacultyValidationSchema),
  academicFacultyController.createAcademicFaculty,
);

router.patch(
  '/:facultyId',
  validateRequest(
    AcademicFacultyValidation.updateAcademicFacultyValidationSchema,
  ),
  academicFacultyController.updateAcademicFaculty,
);

export const AcademicFacultyRoutes = router;
