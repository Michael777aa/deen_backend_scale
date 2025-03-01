import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../libs/Error";
import { CatchAsyncError } from "../libs/utils/catchAsyncErrors";
import { generateLast12MonthsData } from "../libs/utils/analytics.generator";
import MemberModel from "../schema/Member.model";
import OrderModel from "../schema/Order.Model";

// get users analytics -- only for admin
const memberModel = MemberModel;
const orderModel = OrderModel;

export const getUsersAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await generateLast12MonthsData(memberModel);

      res.status(200).json({
        success: true,
        users,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get courses analytics -- only for admin

// export const getCoursesAnalytics = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       // const courses = await generateLast12MonthsData(CourseModel);

//       res.status(200).json({
//         success: true,
//         courses,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );

export const getOrderAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await generateLast12MonthsData(orderModel);

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
