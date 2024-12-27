import mongoose from 'mongoose';
import AppError from '../../errors/appError';
import { OfferedCourse } from '../offered-course/offered-course.model';
import { Student } from '../student/student.model';
import { TEnrolledCourse } from './enrolled-course.interface';
import EnrolledCourse from './enrolled-course.model';
import httpStatus from 'http-status';
import { Course } from '../course/course.model';
import { SemesterRegistration } from '../semester-registration/semester-registration.model';
import { Faculty } from '../faculty/faculty.model';
import { calculateGradeAndPoints } from './enrolled-course.utils';

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

const updateEnrolledCourseMarksIntoDB = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;

  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      'Semester registration not found !',
      httpStatus.NOT_FOUND,
    );
  }

  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);

  if (!isOfferedCourseExists) {
    throw new AppError('Offered course not found !', httpStatus.NOT_FOUND);
  }
  const isStudentExists = await Student.findById(student);

  if (!isStudentExists) {
    throw new AppError('Student not found !', httpStatus.NOT_FOUND);
  }

  const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 });

  if (!faculty) {
    throw new AppError('Faculty not found !', httpStatus.NOT_FOUND);
  }
  const isCourseBelongToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty._id,
  });

  if (!isCourseBelongToFaculty) {
    throw new AppError('You are forbidden! !', httpStatus.FORBIDDEN);
  }
  const modifiedData: Record<string, unknown> = {
    ...courseMarks,
  };

  if (courseMarks?.finalTerm) {
    const { classTest1, classTest2, midTerm, finalTerm } =
      isCourseBelongToFaculty.courseMarks;

    const totalMarks =
      Math.ceil(classTest1 * 0.1) +
      Math.ceil(midTerm * 0.3) +
      Math.ceil(classTest2 * 0.1) +
      Math.ceil(finalTerm * 0.5);

    const result = calculateGradeAndPoints(totalMarks);

    modifiedData.grade = result.grade;
    modifiedData.gradePoints = result.gradePoints;
    modifiedData.isCompleted = true;
  }

  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }
  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongToFaculty._id,
    modifiedData,
    {
      new: true,
      runValidators: true,
      overwrite: false,
    },
  );

  return result;
};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
};
