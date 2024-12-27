import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TOfferedCourse } from './offered-course.interface';
import { SemesterRegistration } from '../semester-registration/semester-registration.model';
import AppError from '../../errors/appError';
import { AcademicFaculty } from '../academic-faculty/academic-faculty.model';
import { AcademicDepartment } from '../academic-department/academic-department.model';
import { Faculty } from '../faculty/faculty.model';
import { Course } from '../course/course.model';
import { OfferedCourse } from './offered-course.model';
import { hasTimeConflict } from './offered-course.utils';
import { Student } from '../student/student.model';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    section,
    faculty,
    days,
    startTime,
    endTime,
  } = payload;

  /**
   * Step 1: check if the semester registration id is exists!
   * Step 2: check if the academic faculty id is exists!
   * Step 3: check if the academic department id is exists!
   * Step 4: check if the course id is exists!
   * Step 5: check if the faculty id is exists!
   * Step 6: check if the department is belong to the  faculty
   * Step 7: check if the same offered course same section in same registered semester exists
   * Step 8: get the schedules of the faculties
   * Step 9: check if the faculty is available at that time. If not then throw error
   * Step 10: create the offered course
   */

  //check if the semester registration id is exists!
  const isSemesterRegistrationExits =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistrationExits) {
    throw new AppError(
      'Semester registration not found !',
      httpStatus.NOT_FOUND,
    );
  }

  const academicSemester = isSemesterRegistrationExits.academicSemester;

  const isAcademicFacultyExits =
    await AcademicFaculty.findById(academicFaculty);

  if (!isAcademicFacultyExits) {
    throw new AppError('Academic Faculty not found !', httpStatus.NOT_FOUND);
  }

  const isAcademicDepartmentExits =
    await AcademicDepartment.findById(academicDepartment);

  if (!isAcademicDepartmentExits) {
    throw new AppError('Academic Department not found !', httpStatus.NOT_FOUND);
  }

  const isCourseExits = await Course.findById(course);

  if (!isCourseExits) {
    throw new AppError('Course not found !', httpStatus.NOT_FOUND);
  }

  const isFacultyExits = await Faculty.findById(faculty);

  if (!isFacultyExits) {
    throw new AppError('Faculty not found !', httpStatus.NOT_FOUND);
  }

  // check if the department is belong to the  faculty
  const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    faculty: academicFaculty,
  });

  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      `This ${isAcademicDepartmentExits.name} is not  belong to this ${isAcademicFacultyExits.name}`,
      httpStatus.BAD_REQUEST,
    );
  }

  // check if the same offered course same section in same registered semester exists

  const isDuplicateCourseInSemesterSection = await OfferedCourse.findOne({
    semesterRegistration,
    course,
    section,
  });

  if (isDuplicateCourseInSemesterSection) {
    throw new AppError(
      `Offered course with same section is already exist!`,
      httpStatus.BAD_REQUEST,
    );
  }

  // get the schedules of the faculties
  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      `This faculty is not available at that time ! Choose other time or day`,
      httpStatus.CONFLICT,
    );
  }

  const result = await OfferedCourse.create({
    ...payload,
    academicSemester,
  });
  return result;
};

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await offeredCourseQuery.modelQuery;
  return result;
};

const getMyOfferedCoursesFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  //pagination setup

  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const skip = (page - 1) * limit;

  const student = await Student.findOne({ id: userId });
  // find the student
  if (!student) {
    throw new AppError('User is noty found', httpStatus.NOT_FOUND);
  }

  //find current ongoing semester
  const currentOngoingRegistrationSemester = await SemesterRegistration.findOne(
    {
      status: 'ONGOING',
    },
  );

  if (!currentOngoingRegistrationSemester) {
    throw new AppError(
      'There is no ongoing semester registration!',
      httpStatus.NOT_FOUND,
    );
  }

  const aggregationQuery = [
    {
      $match: {
        semesterRegistration: currentOngoingRegistrationSemester?._id,
        academicFaculty: student.academicFaculty,
        academicDepartment: student.academicDepartment,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
      },
    },
    {
      $unwind: '$course',
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentOngoingRegistrationSemester:
            currentOngoingRegistrationSemester._id,
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      '$semesterRegistration',
                      '$$currentOngoingRegistrationSemester',
                    ],
                  },
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isEnrolled', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'enrolledCourses',
      },
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isCompleted', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'completedCourses',
      },
    },
    {
      $addFields: {
        completedCourseIds: {
          $map: {
            input: '$completedCourses',
            as: 'completed',
            in: '$$completed.course',
          },
        },
      },
    },
    {
      $addFields: {
        isPreRequisitesFulFilled: {
          $or: [
            { $eq: ['$course.preRequisiteCourses', []] },
            {
              $setIsSubset: [
                '$course.preRequisiteCourses.course',
                '$completedCourseIds',
              ],
            },
          ],
        },

        isAlreadyEnrolled: {
          $in: [
            '$course._id',
            {
              $map: {
                input: '$enrolledCourses',
                as: 'enroll',
                in: '$$enroll.course',
              },
            },
          ],
        },
      },
    },
    {
      $match: {
        isAlreadyEnrolled: false,
        isPreRequisitesFulFilled: true,
      },
    },
  ];

  const paginationQuery = [
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ];

  const result = await OfferedCourse.aggregate([
    ...aggregationQuery,
    ...paginationQuery,
  ]);

  const total = (await OfferedCourse.aggregate(aggregationQuery)).length;

  const totalPage = Math.ceil(result.length / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    result,
  };
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const offeredCourse = await OfferedCourse.findById(id);

  if (!offeredCourse) {
    throw new AppError('Offered Course not found', 404);
  }

  return offeredCourse;
};

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  /**
   * Step 1: check if the offered course exists
   * Step 2: check if the faculty exists
   * Step 3: check if the semester registration status is upcoming
   * Step 4: check if the faculty is available at that time. If not then throw error
   * Step 5: update the offered course
   */
  const { faculty, days, startTime, endTime } = payload;

  const isOfferedCourseExists = await OfferedCourse.findById(id);

  if (!isOfferedCourseExists) {
    throw new AppError('Offered course not found !', httpStatus.NOT_FOUND);
  }

  const isFacultyExists = await Faculty.findById(faculty);

  if (!isFacultyExists) {
    throw new AppError('Faculty not found !', httpStatus.NOT_FOUND);
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration;
  // get the schedules of the faculties

  // Checking the status of the semester registration
  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistration);

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      `You can not update this offered course as it is ${semesterRegistrationStatus?.status}`,
      httpStatus.BAD_REQUEST,
    );
  }

  // check if the faculty is available at that time.
  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      `This faculty is not available at that time ! Choose other time or day`,
      httpStatus.CONFLICT,
    );
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {
  /**
   * Step 1: check if the offered course exists
   * Step 2: check if the semester registration status is upcoming
   * Step 3: delete the offered course
   */
  const isOfferedCourseExists = await OfferedCourse.findById(id);

  if (!isOfferedCourseExists) {
    throw new AppError('Offered Course not found', httpStatus.NOT_FOUND);
  }

  const semesterRegistation = isOfferedCourseExists.semesterRegistration;

  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistation).select('status');

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      `Offered course can not update ! because the semester ${semesterRegistrationStatus}`,
      httpStatus.BAD_REQUEST,
    );
  }

  const result = await OfferedCourse.findByIdAndDelete(id);

  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  getMyOfferedCoursesFromDB,
  deleteOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
};
