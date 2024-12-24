import AppError from "../../errors/appError";
import { OfferedCourse } from "../offered-course/offered-course.model";
import { Student } from "../student/student.model";
import { TEnrolledCourse } from "./enrolled-course.interface";

const createEnrolledCourseIntoDB = async (
    userId: string,
    payload: TEnrolledCourse,
  ) => {
    console.log(payload)

    /**
    * TODO::
    * Step1: Check if the offered cousres is exists
    * Step2: Check if the student is already enrolled
    * Step3: Check if the max credits exceed
    * Step4: Create an enrolled course
    */

    const { offeredCourse } = payload;
    const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);

    if (!isOfferedCourseExists) {
        throw new AppError('Offered course not found !',httpStatus.NOT_FOUND, );
      }

      if (isOfferedCourseExists.maxCapacity <= 0) {
        throw new AppError( 'Room is full !',httpStatus.BAD_GATEWAY,);
      }
    
      const student = await Student.findOne({ id: userId }, { _id: 1 });

      if (!student) {
        throw new AppError('Student not found !',httpStatus.NOT_FOUND, );
      }

  }
export const EnrolledCourseServices = {
    createEnrolledCourseIntoDB,
  };