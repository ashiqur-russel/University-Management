import { Router } from 'express';
import { academicFacultyController } from './academic-faculty.controller';
import validateRequest from '../../utils/validateRequest';
import { AcademicFacultyValidation } from './academic-faculty.validation';

const router = Router();

router.get('/', academicFacultyController.getAllAcademicFaculties);
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

export const academicFacultyRoutes = router;
