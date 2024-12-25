import mongoose from 'mongoose';
import AppError from '../../errors/appError';
import { OfferedCourse } from '../offered-course/offered-course.model';
import { Student } from '../student/student.model';
import { TEnrolledCourse } from './enrolled-course.interface';
import EnrolledCourse from './enrolled-course.model';
import httpStatus from 'http-status';
import { Course } from '../course/course.model';
import { SemesterRegistration } from '../semester-registration/semester-registration.model';

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: { offeredCourse: string },
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

  // check total credits exceeds maxCredit
  const course = await Course.findById(isOfferedCourseExists.course);
  const currentCredit = course?.credits;

  const semesterRegistration = await SemesterRegistration.findById(
    isOfferedCourseExists.semesterRegistration,
  ).select('maxCredit');

  const maxCredit = semesterRegistration?.maxCredit;

  const enrolledCourses = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExists.semesterRegistration,
        student: student._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourseData',
      },
    },
    {
      $unwind: '$enrolledCourseData',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCourse: { $sum: 1 },
        totalEnrolledCredits: { $sum: '$enrolledCourseData.credits' },
      },
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCredits: 1,
        totalEnrolledCourse: 1,
      },
    },
  ]);

  //  check total enrolled credits + new enrolled course credit > maxCredit
  const totalCredits =
    enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0;

  if (totalCredits && maxCredit && totalCredits + currentCredit > maxCredit) {
    throw new AppError(
      'You have exceeded maximum number of credits !',
      httpStatus.BAD_REQUEST,
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const enrolledCourse = new EnrolledCourse({
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

    const result = await enrolledCourse.save({ session });

    if (!result) {
      throw new AppError(
        'Failed to enroll in this course!',
        httpStatus.BAD_REQUEST,
      );
    }

    const maxCapacity = isOfferedCourseExists.maxCapacity;
    await OfferedCourse.findByIdAndUpdate(
      offeredCourse,
      { maxCapacity: maxCapacity - 1 },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  } finally {
    session.endSession();
  }
};

const createEnrolledCourseIntoDB1 = async (
  userId: string,
  payload: { offeredCourse: string },
) => {
  console.log(payload);

  /**
   * Steps:
   * 1. Start a MongoDB transaction
   * 2. Perform all database operations inside the transaction
   * 3. Rollback if any operation fails
   * 4. Commit the transaction on success
   */

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { offeredCourse } = payload;

    // Step 1: Check if the offered course exists
    const isOfferedCourseExists =
      await OfferedCourse.findById(offeredCourse).session(session);
    if (!isOfferedCourseExists) {
      throw new AppError('Offered course not found!', httpStatus.NOT_FOUND);
    }

    if (isOfferedCourseExists.maxCapacity <= 0) {
      throw new AppError('Room is full!', httpStatus.BAD_GATEWAY);
    }

    // Step 2: Check if the student exists
    const student = await Student.findOne({ id: userId }, { _id: 1 }).session(
      session,
    );
    if (!student) {
      throw new AppError('Student not found!', httpStatus.NOT_FOUND);
    }

    // Step 3: Check if the student is already enrolled
    const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
      semesterRegistration: isOfferedCourseExists.semesterRegistration,
      offeredCourse,
      student: student._id,
    }).session(session);

    if (isStudentAlreadyEnrolled) {
      throw new AppError('Student is already enrolled!', httpStatus.CONFLICT);
    }

    // Step 4: Create an enrolled course
    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: isOfferedCourseExists.semesterRegistration,
          academicSemester: isOfferedCourseExists.academicSemester,
          academicFaculty: isOfferedCourseExists.academicFaculty,
          academicDepartment: isOfferedCourseExists.academicDepartment,
          offeredCourse: offeredCourse,
          course: isOfferedCourseExists.course,
          student: student._id,
          faculty: isOfferedCourseExists.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );

    if (!result) {
      throw new AppError(
        'Failed to enroll in this course!',
        httpStatus.BAD_REQUEST,
      );
    }

    // Step 5: Update max capacity
    const maxCapacity = isOfferedCourseExists.maxCapacity;
    const updatedCourse = await OfferedCourse.findByIdAndUpdate(
      offeredCourse,
      { maxCapacity: maxCapacity - 1 },
      { session },
    );

    if (!updatedCourse) {
      throw new AppError(
        'Failed to update course capacity!',
        httpStatus.BAD_REQUEST,
      );
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    // Rollback the transaction
    await session.abortTransaction();
    session.endSession();

    throw error; // Rethrow the error for error handling
  }
};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
};
