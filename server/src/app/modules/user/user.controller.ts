import { Request, Response } from 'express';
import { UserService } from './user.service';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData, password } = req.body;

    const result = await UserService.createStudent(studentData, password);

    if (result) {
      res.status(201).json({
        success: true,
        message: 'Student is created successfully',
        data: result,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Student creation unsuccessful!',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Student creation unsuccessful!',
      error,
    });
  }
};

export const UserController = {
  createStudent,
};
