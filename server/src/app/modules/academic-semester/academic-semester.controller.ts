import { Request, Response } from "express";
import { Academic-semesterService } from "./academic-semester.service";

const findAll = async (req: Request, res: Response) => {
  const data = await Academic-semesterService.findAll();
  res.json(data);
};

export const Academic-semesterController = {
  findAll,
};
          