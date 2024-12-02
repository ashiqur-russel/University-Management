import { Router } from "express";
import { Academic-semesterController } from "./academic-semester.controller";

const router = Router();

router.get("/", Academic-semesterController.findAll);

export default router;
          