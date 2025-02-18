import CourseModel from "../schema/Course.model";
import { CatchAsyncError } from "../libs/utils/catchAsyncErrors";
import { Response } from "express";

export const createCourse = CatchAsyncError(
  async (data: any, res: Response) => {
    const course = await CourseModel.create(data);
    console.log("RESULT", course);

    res.status(201).json({
      success: true,
      course,
    });
  }
);

// get all users

export const getAllCoursesService = async (res: Response) => {
  const courses = await CourseModel.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    courses,
  });
};
