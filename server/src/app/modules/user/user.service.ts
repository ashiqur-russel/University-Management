import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/appError';
import { AcademicDepartment } from '../academic-department/academic-department.model';
import { AcademicSemester } from '../academic-semester/academic-semester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { generateStudentId } from '../student/student.utils';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateHashedPassword } from './user.utils';

const createStudent1 = async (studentData: TStudent, password: string) => {
  const userData: Partial<TUser> = {};

  password = password || (config.default_pass as string);

  userData.id = await generateStudentId(studentData);
  userData.role = 'student';
  userData.password = await generateHashedPassword(password);

  const isUserExist = await User.findOne({ id: userData.id });

  if (isUserExist) {
    throw new AppError('User already exist with the id', 409);
  }

  // create user
  const newUser = await User.create(userData);

  const academicSemesterExists = await AcademicSemester.findById({
    _id: studentData.admissionSemester,
  });

  if (!academicSemesterExists) {
    await User.deleteOne({ _id: newUser._id });
    throw new AppError('Invalid Academic Semester Entered', 403);
  }

  const academicDepartmentExists = await AcademicDepartment.findById({
    _id: studentData.academicDepartment,
  });

  if (!academicDepartmentExists) {
    await User.deleteOne({ _id: newUser._id });
    throw new AppError('Invalid Academic Department Entered', 403);
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
const createStudent = async ( payload: TStudent,password: string) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_pass as string);

  //set student role
  userData.role = 'student';

  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateStudentId(payload);

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // array

    //create a student
    if (!newUser.length) {
      throw new AppError('Failed to create user',httpStatus.BAD_REQUEST);
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a student (transaction-2)

    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError( 'Failed to create student',httpStatus.BAD_REQUEST);
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to create student');
  }
};

export const UserService = {
  createStudent,
};
