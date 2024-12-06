import mongoose, { model, Schema } from 'mongoose';
import { TAcademicDepartment } from './academic-department.interface';
import { AcademicFaculty } from '../academic-faculty/academic-faculty.model';

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

AcademicDepartemntSchema.pre('save', async function (next) {
  const facultyExist = await AcademicFaculty.findOne({ _id: this.faculty });
  const departmentAlreadyExist = await AcademicDepartment.findOne({
    name: this.name,
  });

  if (!facultyExist) {
    const error = new Error('Faculty does not exist!');
    return next(error);
  }
  if (departmentAlreadyExist) {
    const error = new Error('Department already exist!');
    return next(error);
  }

  next();
});

AcademicDepartemntSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isDepartmentExist = await AcademicDepartment.findOne(query);

  if (!isDepartmentExist) {
    throw new Error('This department does not exist! ');
  }

  next();
});

export const AcademicDepartment = model(
  'AcademicDepartemnt',
  AcademicDepartemntSchema,
);
