import { AcademicSemester } from '../academic-semester/academic-semester.model';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';

export const generateStudentId = async (studentData: TStudent) => {
  try {
    const result = await AcademicSemester.findById(
      studentData.admissionSemester,
    );
    if (!result || !result.code || !result.year) {
      throw new Error('Invalid result or missing code/year.');
    }
    const currentId =
      (await findLastStudentId()) || (0).toString().padStart(4, '0');
    let incrementId = (Number(currentId) + 1).toString();

    incrementId = incrementId.toString().padStart(4, '0');
    const studentId = `${result?.year}-${result?.code}-${incrementId}`;

    return studentId.toString();
  } catch (error) {
    console.error(error);
    throw new Error('Error generating student id');
  }
};

export const findLastStudentId = async () => {
  try {
    const lastStudent = await User.findOne(
      {
        role: 'student',
      },
      { id: 1, _id: 0 },
    )
      .sort({ createdAt: -1 })
      .lean();

    return lastStudent?.id ? lastStudent.id.substring(8) : undefined;
  } catch (error) {
    console.error(error);
    throw new Error('Error fining student id');
  }
};
