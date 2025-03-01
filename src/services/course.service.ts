import { CatchAsyncError } from "../libs/utils/catchAsyncErrors";
import { Response } from "express";
import CourseModel from "../schema/Course.model";

const courseModel = CourseModel;

export const createCourse = CatchAsyncError(
  async (data: any, res: Response) => {
    const course = await courseModel.create(data);

    res.status(201).json({
      success: true,
      course,
    });
  }
);

// get all users

export const getAllCoursesService = async (res: Response) => {
  const courses = await courseModel.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    courses,
  });
};
