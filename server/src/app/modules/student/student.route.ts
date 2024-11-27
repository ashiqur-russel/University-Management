import { Router } from 'express';
import { StudentController } from './student.controller';

const router = Router();

router.get('/', StudentController.getAllStudents);
router.get('/:studentId', StudentController.getSingleStudent);
router.delete('/:studentId', StudentController.deleteStudent);

export const StudentRoutes = router;
