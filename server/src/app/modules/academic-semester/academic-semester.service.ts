import { TAcademicSemesterCode } from './academic-semester.interface';
import { AcademicSemester } from './academic-semester.model';

const createAcademicSemester = async (payload: TAcademicSemesterCode) => {
  return await AcademicSemester.create(payload);
};

export const AcademicSemesterService = {
  createAcademicSemester,
};
