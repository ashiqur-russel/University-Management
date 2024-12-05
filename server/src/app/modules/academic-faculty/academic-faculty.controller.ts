import { Request, Response } from 'express';
import { academicFacultyService } from './academic-faculty.service';

const findAll = async (req: Request, res: Response) => {
  const data = await academicFacultyService.findAll();
  res.json(data);
};

export const academicFacultyController = {
  findAll,
};
