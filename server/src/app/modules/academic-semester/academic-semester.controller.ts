import { Request, Response } from 'express';
import { AcademicSemesterService } from './academic-semester.service';

const findAll = async (req: Request, res: Response) => {
  const data = await AcademicSemesterService.findAll();
  res.json(data);
};

export const AcademicSemesterController = {
  findAll,
};
