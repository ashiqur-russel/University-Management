import { Router } from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../utils/validateRequest';
import { updateStudentValidationSchema } from './student.validation';
import AuthGuard from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.get('/', AuthGuard(USER_ROLE.admin), StudentController.getAllStudents);
router.get(
  '/:studentId',
  AuthGuard(USER_ROLE.faculty, USER_ROLE.admin),
  StudentController.getSingleStudent,
);
router.delete(
  '/:studentId',
  AuthGuard(USER_ROLE.admin),
  StudentController.deleteStudent,
);
router.patch(
  '/:studentId',
  AuthGuard(USER_ROLE.admin),
  validateRequest(updateStudentValidationSchema),
  StudentController.updateStudent,
);

export const StudentRoutes = router;
