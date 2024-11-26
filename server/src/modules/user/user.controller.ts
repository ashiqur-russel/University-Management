import { Request, Response } from "express";
import { UserService } from "./user.service";

const findAll = async (req: Request, res: Response) => {
  const data = await UserService.findAll();
  res.json(data);
};

export const UserController = {
  findAll,
};
          