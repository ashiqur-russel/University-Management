import { AcademicSemester } from '../academic-semester/academic-semester.model';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';

export const generateStudentId = async (studentData: TStudent) => {
  try {
    let studentId;
    let incrementId;
    const result = await AcademicSemester.findById(
      studentData.admissionSemester,
    );

    if (!result || !result.code || !result.year) {
      throw new Error('Invalid result or missing code/year.');
    }

    const lastStudentId = await findLastStudentId();

    const lastRegisteredIdYear = lastStudentId?.substring(0, 4);
    const lastRegisteredIdCode = lastStudentId?.substring(5, 7);
    const lastRegisteredId = lastStudentId?.substring(8);

    if (
      lastStudentId &&
      lastRegisteredId !== undefined &&
      lastRegisteredIdYear === result.year &&
      lastRegisteredIdCode === result.code
    ) {
      studentId = Number(lastRegisteredId) + 1;

      incrementId = studentId.toString().padStart(4, '0');
      studentId = `${result?.year}-${result?.code}-${incrementId}`;

      return studentId;
    } else {
      const currentId = (0).toString().padStart(4, '0');
      incrementId = (Number(currentId) + 1).toString();

      incrementId = incrementId.toString().padStart(4, '0');
      studentId = `${result?.year}-${result?.code}-${incrementId}`;

      return studentId;
    }
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

    return lastStudent?.id ? lastStudent.id : undefined;
  } catch (error) {
    console.error(error);
    throw new Error('Error fining student id');
  }
};
