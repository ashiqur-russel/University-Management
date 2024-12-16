import { Router } from 'express';
import { UserRoutes } from '../app/modules/user/user.route';
import { StudentRoutes } from '../app/modules/student/student.route';
import { AcademicSemesterRoutes } from '../app/modules/academic-semester/academic-semester.route';
import { AcademicFacultyRoutes } from '../app/modules/academic-faculty/academic-faculty.route';
import { AcadmicDepartmentRoutes } from '../app/modules/academic-department/academic-department.route';
import { FacultyRoutes } from '../app/modules/Faculty/faculty.route';
import { CourseRoutes } from '../app/modules/Course/course.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/faculties',
    route: FacultyRoutes,
  },
  {
    path: '/academic-semester',
    route: AcademicSemesterRoutes,
  },
  {
    path: '/academic-faculty',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/academic-department',
    route: AcadmicDepartmentRoutes,
  },
  {
    path: '/courses',
    route: CourseRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
