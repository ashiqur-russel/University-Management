import { Router } from "express";
import { Academic-departmentController } from "./academic-department.controller";

const router = Router();

router.get("/", Academic-departmentController.findAll);

export default router;
          