import AppError from '../../errors/appError';
import { Student } from './student.model';

const getAllStudentsFromDB = async () => {
  const result = await Student.find()
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'faculty',
      },
    });

  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.aggregate([{ $match: { id } }]);
  if (!result) {
    throw new AppError('Student is not found', 404);
  }
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true });
  return result;
};

export const StudentService = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
};
