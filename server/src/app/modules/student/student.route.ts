import { Router } from 'express';
import { StudentController } from './student.controller';

const router = Router();

router.get('/', StudentController.findAll);

export default router;
