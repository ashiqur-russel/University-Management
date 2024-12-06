import { Request, Response } from 'express';
import { AcademicDpartmentService } from './academic-department.service';

const findAll = async (req: Request, res: Response) => {
  const data = await AcademicDpartmentService.findAll();
  res.json(data);
};

export const AcademicDpartmentController = {
  findAll,
};
