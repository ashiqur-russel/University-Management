import { Router } from 'express';
import { academicFacultyController } from './academic-faculty.controller';

const router = Router();

router.get('/', academicFacultyController.findAll);

export const academicFacultyRoutes = router;
