import { Router } from 'express';
import { academicFacultyController } from './academic-faculty.controller';
import validateRequest from '../../utils/validateRequest';
import { AcademicFacultyValidation } from './academic-faculty.validation';
import Auth from '../../middlewares/auth';
import AuthGuard from '../../middlewares/auth';
import { Faculty } from '../faculty/faculty.model';

const router = Router();

router.get('/', AuthGuard('admin'), academicFacultyController.getAllAcademicFaculties);
router.get('/:facultyId',AuthGuard('admin'), academicFacultyController.getSingleAcademicFaculty);

router.post(
  '/create-faculty',AuthGuard('admin'),
  validateRequest(AcademicFacultyValidation.academicFacultyValidationSchema),
  academicFacultyController.createAcademicFaculty,
);

router.patch(
  '/:facultyId',
  validateRequest(
    AcademicFacultyValidation.updateAcademicFacultyValidationSchema,
  ),AuthGuard('admin'),
  academicFacultyController.updateAcademicFaculty,
);

export const AcademicFacultyRoutes = router;
