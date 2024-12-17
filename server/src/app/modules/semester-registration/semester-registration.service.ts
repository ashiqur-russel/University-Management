import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/appError';
import { AcademicSemester } from '../academic-semester/academic-semester.model';
import { TSemesterRegistration } from './semester-registration.interface';
import { SemesterRegistration } from './semester-registration.model';
import httpStatus from 'http-status';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  // TODO: check date is past or not
  // Calculate automatically semester start and end date
  const academicSemester = payload?.academicSemester;
  const isSemesterAlreadyRegistered = await SemesterRegistration.findOne({
    academicSemester,
  });
  const isAcademicSemesterExist = await AcademicSemester.findById({
    _id: payload.academicSemester,
  });

  if (isSemesterAlreadyRegistered) {
    throw new AppError('Semester is already Registered!', httpStatus.CONFLICT);
  }

  if (!isAcademicSemesterExist) {
    throw new AppError('Academic Semester is not exist!', httpStatus.NOT_FOUND);
  }

  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

const getSingleSemesterRegistrationsFromDB = async (id: string) => {
  const result =
    await SemesterRegistration.findById(id).populate('academicSemester');

  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {};

const deleteSemesterRegistrationFromDB = async (id: string) => {};

export const SemesterRegistrationService = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationsFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB,
};
