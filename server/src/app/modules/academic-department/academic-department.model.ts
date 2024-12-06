import mongoose, { model, Schema } from 'mongoose';
import { TAcademicDepartment } from './academic-department.interface';

const AcademicDepartemntSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    faculty: {
      type: mongoose.Schema.ObjectId,
      ref: 'AcademicFaculty',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const AcademicDepartment = model(
  'AcademicDepartemnt',
  AcademicDepartemntSchema,
);
