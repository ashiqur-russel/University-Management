import mongoose from 'mongoose';
import AppError from '../../errors/appError';
import { OfferedCourse } from '../offered-course/offered-course.model';
import { Student } from '../student/student.model';
import { TEnrolledCourse } from './enrolled-course.interface';
import EnrolledCourse from './enrolled-course.model';
import httpStatus from 'http-status';

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  console.log(payload);

  /**
   * TODO::
   * Step1: Check if the offered cousres is exists
   * Step2: Check if the student is already enrolled
   * Step3: Check if the max credits exceed
   * Step4: Create an enrolled course
   */

  const { offeredCourse } = payload;
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);

  if (!isOfferedCourseExists) {
    throw new AppError('Offered course not found !', httpStatus.NOT_FOUND);
  }

  if (isOfferedCourseExists.maxCapacity <= 0) {
    throw new AppError('Room is full !', httpStatus.BAD_GATEWAY);
  }

  const student = await Student.findOne({ id: userId }, { _id: 1 });

  if (!student) {
    throw new AppError('Student not found !', httpStatus.NOT_FOUND);
  }

  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
    offeredCourse,
    student: student._id,
  });

  if (isStudentAlreadyEnrolled) {
    throw new AppError('Student is already enrolled !', httpStatus.CONFLICT);
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const result = await EnrolledCourse.create({
      semesterRegistration: isOfferedCourseExists.semesterRegistration,
      academicSemester: isOfferedCourseExists.academicSemester,
      academicFaculty: isOfferedCourseExists.academicFaculty,
      academicDepartment: isOfferedCourseExists.academicDepartment,
      offeredCourse: offeredCourse,
      course: isOfferedCourseExists.course,
      student: student._id,
      faculty: isOfferedCourseExists.faculty,
      isEnrolled: true,
    });

    if (!result) {
      throw new AppError(
        'Failed to enroll in this cousre !',
        httpStatus.BAD_REQUEST,
      );
    }

    const maxCapacity = isOfferedCourseExists.maxCapacity;
    await OfferedCourse.findByIdAndUpdate(offeredCourse, {
      maxCapacity: maxCapacity - 1,
    });

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};
export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
};
