import AuthGuard from "../../middlewares/auth";
import validateRequest from "../../utils/validateRequest";
import { USER_ROLE } from "../user/user.constant";
import express from 'express';
import { EnrolledCourseValidations } from "./enrolled-course.validation";
import { EnrolledCourseControllers } from "./enrolled-course.controller";

const router = express.Router();

router.post(
  '/create-enrolled-course',
  AuthGuard(USER_ROLE.student),
  validateRequest(
    EnrolledCourseValidations.createEnrolledCourseValidationZodSchema,
  ),
  EnrolledCourseControllers.createEnrolledCourse,
);

