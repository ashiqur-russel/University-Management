import { Request, Response } from "express";
import { Academic-departmentService } from "./academic-department.service";

const findAll = async (req: Request, res: Response) => {
  const data = await Academic-departmentService.findAll();
  res.json(data);
};

export const Academic-departmentController = {
  findAll,
};
          