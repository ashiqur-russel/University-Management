import { Request, Response } from 'express';
import { StudentService } from './student.service';

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentService.getSingleStudentFromDB(studentId);

    res.status(200).json({
      success: true,
      message: 'Students data retrieved succesfully',
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Students data retrieve failed',
      err,
    });
  }
};

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentService.getAllStudentsFromDB();

    res.status(200).json({
      success: true,
      message: 'Students is retrieved succesfully',
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Students is retrieved failed',
      err,
    });
  }
};

const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentService.deleteStudentFromDB(studentId);

    res.status(200).json({
      success: true,
      message: 'Student deleted succesfully',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Student deletation failed',
      err,
    });
  }
};

export const StudentController = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
