import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/appError';
import { CourseSearchableFields } from './course.constant';
import { TCourse, TCoursefaculty } from './course.interface';
import { Course, CourseFaculty } from './course.model';
import httpStatus from 'http-status';

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(Course.find(), query)
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await courseQuery.modelQuery;
  return result;
};
const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id);
  if (!result) {
    throw new AppError('Course not found', httpStatus.NOT_FOUND);
  }
  return result;
};

const deleteCourseFromDB = async (id: string) => {
  const isCoursetExist = await Course.findOne({ _id: id });

  if (!isCoursetExist) {
    throw new AppError('Course Not Found', httpStatus.NOT_FOUND);
  }

  try {
    const result = await Course.findByIdAndUpdate(
      id,
      { isDeleted: true },
      {
        new: true,
      },
    );
    return result;
  } catch (error) {}
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...courseRemainingData } = payload;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseRemainingData,
      { new: true, runValidators: true, session },
    );

    if (!updatedBasicCourseInfo) {
      throw new AppError('Failed to update course!', httpStatus.BAD_REQUEST);
    }

    // check if there is any pre requisite courses to update
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      // filter out the deleted fields
      const deletedPreRequisites = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);

      const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisites } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!deletedPreRequisiteCourses) {
        throw new AppError(
          'Failed to remove/update course!',
          httpStatus.BAD_REQUEST,
        );
      }

      const newPreRequisiteCourses = preRequisiteCourses?.filter(
        (el) => el.course && !el.isDeleted,
      );

      const addedPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisiteCourses } },
        },
        { new: true, runValidators: true, session },
      );

      if (!addedPreRequisiteCourses) {
        throw new AppError(
          'Failed to add/update course!',
          httpStatus.BAD_REQUEST,
        );
      }
      await session.commitTransaction();
      await session.endSession();

      const result = await Course.find({ _id: id }).populate(
        'preRequisiteCourses.course',
      );
      return result;
    }
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError('Failed to update course!', httpStatus.BAD_REQUEST);
  }
};

const assignFacultiesWithCourseIntoDB = async (
  id: string,
  payload: Partial<TCoursefaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    {
      upsert: true,
      new: true,
    },
  );
  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  deleteCourseFromDB,
  updateCourseIntoDB,
  assignFacultiesWithCourseIntoDB,
};
