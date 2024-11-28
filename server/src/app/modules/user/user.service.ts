import config from '../../config';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import bcrypt from 'bcrypt';

const createStudent = async (studentData: TStudent, password: string) => {
  const userData: Partial<TUser> = {};

  password = password || (config.default_pass as string);
  userData.id = '2024-01-01';
  userData.role = 'student';

  userData.password = await generateHashedPassword(password);

  // create user
  const newUser = await User.create(userData);

  //create student
  if (Object.keys(newUser).length) {
    studentData.id = newUser.id;
    studentData.user = newUser._id;

    const newStudent = await Student.create(studentData);

    const data = { ...newUser, ...newStudent };
    return data;
  }
};

const generateHashedPassword = async (password: string): Promise<string> => {
  const hashPassword = await bcrypt.hash(password, Number(config.bcrypt_salt));
  return hashPassword;
};
export const UserService = {
  createStudent,
};
