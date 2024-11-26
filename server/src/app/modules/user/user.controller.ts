import { Request, Response } from 'express';
import { UserService } from './user.service';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;

    const result = await UserService.createStudent(studentData);

    if (result) {
      res.status(201).json({
        success: true,
        message: 'Student is created succesfully',
        data: result,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Student creation unsuccessful!',
      error,
    });
  }
};

export const UserController = {
  createStudent,
};
