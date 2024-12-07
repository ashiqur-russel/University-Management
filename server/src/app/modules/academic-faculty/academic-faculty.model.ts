import { model, Schema } from 'mongoose';
import { TAcademicFaculty } from './academic-faculty.interface';

const AcademicFacultySchema = new Schema<TAcademicFaculty>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    collection: 'academicFaculties',
  },
);

export const AcademicFaculty = model<TAcademicFaculty>(
  'AcademicFaculty',
  AcademicFacultySchema,
);
