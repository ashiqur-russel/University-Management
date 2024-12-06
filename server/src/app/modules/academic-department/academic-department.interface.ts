import { Types } from 'mongoose';

export type TAcademicDepartment = {
  name: string;
  faculty: Types.ObjectId;
};
