import { Router } from 'express';
import { AcademicDpartmentController } from './academic-department.controller';

const router = Router();

router.get('/', AcademicDpartmentController.findAll);

export default router;
