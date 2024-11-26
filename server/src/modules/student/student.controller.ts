import { Request, Response } from "express";
import { StudentService } from "./student.service";

const findAll = async (req: Request, res: Response) => {
  const data = await StudentService.findAll();
  res.json(data);
};

export const StudentController = {
  findAll,
};
          