import { TAcademicDepartment } from './academic-department.interface';
import { AcademicDepartment } from './academic-department.model';

const findAll = async (): Promise<string> => {
  return 'hello world';
};

const createAcademicDepartment = async (payload: TAcademicDepartment) => {
  const result = await AcademicDepartment.create(payload);
  return result;
};

export const AcademicDpartmentService = {
  findAll,
  createAcademicDepartment,
};
