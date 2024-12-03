import config from '../../config';
import { AcademicSemester } from '../academic-semester/academic-semester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import bcrypt from 'bcrypt';

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

  //create student
  if (!isUserExist && Object.keys(newUser).length) {
    studentData.id = newUser.id;
    studentData.user = newUser._id;

    const newStudent = await Student.create(studentData);

    const data = { ...newUser, ...newStudent };
    return data;
  }
};

const generateStudentId = async (studentData: TStudent) => {
  try {
    const result = await AcademicSemester.findById(
      studentData.admissionSemester,
    );
    if (!result || !result.code || !result.year) {
      throw new Error('Invalid result or missing code/year.');
    }
    const currentId =
      (await findLastStudentId()) || (0).toString().padStart(4, '0');
    let incrementId = (Number(currentId) + 1).toString();

    incrementId = incrementId.toString().padStart(4, '0');
    const studentId = `${result?.year}-${result?.code}-${incrementId}`;

    return studentId.toString();
  } catch (error) {
    console.log(error);
    throw new Error('Error generating student id');
  }
};

const findLastStudentId = async () => {
  try {
    const lastStudent = await User.findOne(
      {
        role: 'student',
      },
      { id: 1, _id: 0 },
    )
      .sort({ createdAt: -1 })
      .lean();

    return lastStudent?.id ? lastStudent.id.substring(8) : undefined;
  } catch (error) {
    console.log(error);
    throw new Error('Error fining student id');
  }
};

const generateHashedPassword = async (password: string): Promise<string> => {
  const hashPassword = await bcrypt.hash(password, Number(config.bcrypt_salt));
  return hashPassword;
};
export const UserService = {
  createStudent,
};
