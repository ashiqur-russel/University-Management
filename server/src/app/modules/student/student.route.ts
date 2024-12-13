import { Router } from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../utils/validateRequest';
import { updateStudentValidationSchema } from './student.validation';

const router = Router();

router.get('/', StudentController.getAllStudents);
router.get('/:studentId', StudentController.getSingleStudent);
router.delete('/:studentId', StudentController.deleteStudent);
router.patch('/:studentId', validateRequest(updateStudentValidationSchema), StudentController.updateStudent);

export const StudentRoutes = router;
