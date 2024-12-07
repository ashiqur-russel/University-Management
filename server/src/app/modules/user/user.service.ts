import config from '../../config';
import { AcademicDepartment } from '../academic-department/academic-department.model';
import { AcademicSemester } from '../academic-semester/academic-semester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { generateStudentId } from '../student/student.utils';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateHashedPassword } from './user.utils';

const createStudent = async (studentData: TStudent, password: string) => {
  const userData: Partial<TUser> = {};

  password = password || (config.default_pass as string);

  userData.id = await generateStudentId(studentData);
  userData.role = 'student';
  userData.password = await generateHashedPassword(password);

  const isUserExist = await User.findOne({ id: userData.id });

  if (isUserExist) {
    throw new Error('User already exist with the id');
  }

  // create user
  const newUser = await User.create(userData);

  const academicSemesterExists = await AcademicSemester.findById({
    _id: studentData.admissionSemester,
  });

  if (!academicSemesterExists) {
    await User.deleteOne({ _id: newUser._id });
    throw new Error('Invalid Academic Semester Entered');
  }

  const academicDepartmentExists = await AcademicDepartment.findById({
    _id: studentData.academicDepartment,
  });

  if (!academicDepartmentExists) {
    await User.deleteOne({ _id: newUser._id });
    throw new Error('Invalid Academic Department Entered');
  }

  //create student
  if (!isUserExist && Object.keys(newUser).length) {
    studentData.id = newUser.id;
    studentData.user = newUser._id;

    const newStudent = await Student.create(studentData);

    const data = { ...newUser, ...newStudent };
    return data;
  }
};

export const UserService = {
  createStudent,
};
