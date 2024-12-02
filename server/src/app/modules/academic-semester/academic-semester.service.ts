import { academicSemesterNameCodeMapper } from './academic-semester.constant';
import { TAcademicSemester } from './academic-semester.interface';
import { AcademicSemester } from './academic-semester.model';

const createAcademicSemester = async (payload: TAcademicSemester) => {
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid Semester Code !');
  }
  return await AcademicSemester.create(payload);
};

export const AcademicSemesterService = {
  createAcademicSemester,
};
