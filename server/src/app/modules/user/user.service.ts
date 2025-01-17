import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/appError';
import { AcademicDepartment } from '../academic-department/academic-department.model';
import { AcademicSemester } from '../academic-semester/academic-semester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { generateStudentId } from '../student/student.utils';
import { IUser } from './user.interface';
import { User } from './user.model';
import { generateAdminId, generateFacultyId } from './user.utils';
import { TFaculty } from '../faculty/faculty.interface';
import { Faculty } from '../faculty/faculty.model';
import { Admin } from '../admin/admin.model';
import { USER_ROLE } from './user.constant';
import httpStatus from 'http-status';
import { sendImageToCloudinary } from '../../utils/saveImageToCloud';
import { TAdmin } from '../admin/admin.interface';

const createStudent = async (
  payload: TStudent,
  password: string,
  file?: any,
) => {
  // create a user object
  const userData: Partial<IUser> = {};
  //if password is not given , use deafult password
  userData.password = password || (config.default_pass as string);

  //set student role
  userData.role = 'student';
  userData.email = payload.email;

  // find academic semester info
  await AcademicSemester.findById(payload.admissionSemester);

  // find academic department
  const academicDepartment = await AcademicDepartment.findById({
    _id: payload.academicDepartment,
  });

  if (!academicDepartment || !academicDepartment.faculty) {
    throw new AppError(
      'Academic department or faculty not found',
      httpStatus.NOT_FOUND,
    );
  }
  payload.academicFaculty = academicDepartment.faculty;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateStudentId(payload);

    //send image to cloudinary
    if (file) {
      await uploadImage(payload, userData, file);
    }

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    //create a student
    if (!newUser.length) {
      throw new AppError('Failed to create user', httpStatus.BAD_REQUEST);
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    // create a student (transaction-2)

    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError('Failed to create student', httpStatus.BAD_REQUEST);
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to create student');
  }
};

const createFaculty = async (
  payload: TFaculty,
  password: string,
  file?: any,
) => {
  // create a user object
  const userData: Partial<IUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_pass as string);

  //set student role
  userData.role = 'faculty';
  userData.email = payload.email;

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError('Academic department not found', httpStatus.NOT_FOUND);
  }

  if (!academicDepartment || !academicDepartment.faculty) {
    throw new AppError(
      'Academic department or faculty not found',
      httpStatus.NOT_FOUND,
    );
  }
  payload.academicFaculty = academicDepartment.faculty;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateFacultyId();

    //send image to cloudinary
    if (file) {
      await uploadImage(payload, userData, file);
    }

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // array

    //create a student
    if (!newUser.length) {
      throw new AppError('Failed to create user', httpStatus.BAD_REQUEST);
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a student (transaction-2)

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError('Failed to create faculty', httpStatus.BAD_REQUEST);
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createAdmin = async (password: string, payload: TFaculty, file?: any) => {
  // create a user object
  const userData: Partial<IUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_pass as string);

  //set student role
  userData.role = 'admin';
  userData.email = payload.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateAdminId();

    //send image to cloudinary
    if (file) {
      await uploadImage(payload, userData, file);
    }
    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    //create a admin
    if (!newUser.length) {
      throw new AppError('Failed to create admin', httpStatus.BAD_REQUEST);
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError('Failed to create admin', httpStatus.BAD_REQUEST);
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getMe = async (id: string, role: string) => {
  if (role === USER_ROLE.student) {
    return await Student.findOne({ id });
  } else if (role === USER_ROLE.faculty) {
    return await Faculty.findOne({ id });
  } else if (role === USER_ROLE.admin) {
    return await Admin.findOne({ id });
  } else {
    throw new AppError('Forbidden', httpStatus.FORBIDDEN);
  }
};

const uploadImage = async (
  payload: TStudent | TFaculty | TAdmin,
  userData: Partial<IUser>,
  file?: any,
) => {
  const imageName = `${userData.id}_${payload?.name?.firstName}`;
  const imagePath = file?.path;

  const uploadImageResponse = await sendImageToCloudinary(imageName, imagePath);

  if (!uploadImageResponse || !uploadImageResponse.secure_url) {
    throw new AppError(
      'Failed to upload image',
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  const { secure_url } = uploadImageResponse || null;
  payload.profileImg = secure_url;
};

export const UserService = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
};
