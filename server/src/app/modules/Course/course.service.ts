import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/appError';
import { CourseSearchableFields } from './course.constant';
import { TCourse } from './course.interface';
import { Course } from './course.model';
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
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedCourse = await Course.findByIdAndUpdate(
      id,
      { isDeleted: true },
      {
        new: true,
      },
    );

    if (!deletedCourse) {
      throw new AppError('Failed to delete Course', httpStatus.BAD_REQUEST);
    }

    const deletedFromPreRequiteCourses = await Course.updateMany(
      { 'preRequisiteCourses.course': id },
      { $set: { 'preRequisiteCourses.$.isDeleted': true } },
    );

    if (!deletedFromPreRequiteCourses) {
      throw new AppError(
        'Failed to update preRequisite course data',
        httpStatus.BAD_REQUEST,
      );
    }
    await session.commitTransaction();
    await session.endSession();

    return deletedFromPreRequiteCourses;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...courseRemainingData } = payload;

  const updateBasicCoourseInfo = await Course.findByIdAndUpdate(
    id,
    courseRemainingData,
    { new: true, runValidators: true },
  );
  return updateBasicCoourseInfo;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  deleteCourseFromDB,
  updateCourseIntoDB,
};
