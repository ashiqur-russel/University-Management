import config from '../../config';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';

const createStudent = async (studentData: TStudent, password: string) => {
  const userData: Partial<TUser> = {};

  userData.password = password || (config.default_pass as string);
  userData.id = '12345';
  userData.role = 'student';

  // create user
  const newUser = await User.create(userData);
  //create student

  if (Object.keys(newUser).length) {
    studentData.id = newUser.id;
    studentData.user = newUser._id;

    const newStudent = await Student.create(studentData);
    return newStudent;
  }
};

export const UserService = {
  createStudent,
};
