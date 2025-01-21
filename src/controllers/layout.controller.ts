import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../libs/Error";
import { CatchAsyncError } from "../libs/utils/catchAsyncErrors";
import { IUser } from "../schema/Member.model";
import LayoutModel from "../schema/Layout.model";
import cloudinary from "cloudinary";

export const createLayout = CatchAsyncError(
  async (
    req: Request & { user?: IUser },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { type } = req.body;

      // Check if layout type already exists
      const isTypeExist = await LayoutModel.findOne({ type });
      if (isTypeExist) {
        return next(new ErrorHandler(`${type} already exists`, 400)); // FIXED condition
      }

      let newLayout;

      if (type === "Banner") {
        const { image, title, subTitle } = req.body;
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });

        newLayout = {
          type: "Banner",
          image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
          title,
          subTitle,
        };
      }

      if (type === "FAQ") {
        const { faq } = req.body;
        const faqItems = faq.map((item: any) => ({
          question: item.question,
          answer: item.answer,
        }));

        newLayout = {
          type: "FAQ",
          faq: faqItems,
        };
      }

      if (type === "Categories") {
        const { categories } = req.body;
        const categoriesItems = categories.map((item: any) => ({
          title: item.title,
        }));

        newLayout = {
          type: "Categories",
          categories: categoriesItems,
        };
      }

      if (!newLayout) {
        return next(new ErrorHandler(`Invalid layout type: ${type}`, 400));
      }

      await LayoutModel.create(newLayout);

      res.status(201).json({
        success: true,
        message: "Layout created successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Edit layout

export const editLayout = CatchAsyncError(
  async (
    req: Request & { user?: IUser },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { type } = req.body;

      let banner;

      if (type === "Banner") {
        const { image, title, subTitle } = req.body;
        const bannerData = await LayoutModel.findOne({ type: "Banner" });

        if (bannerData) {
          await cloudinary.v2.uploader.destroy(req.body.public_id);
        }
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });
        banner = {
          type: "Banner",
          image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
          title,
          subTitle,
        };
        await LayoutModel.findByIdAndUpdate(bannerData?._id, { banner });
      }

      if (type === "FAQ") {
        const { faq } = req.body;
        const FaqItem = await LayoutModel.findOne({ type: "FAQ" });
        const faqItems = faq.map((item: any) => ({
          question: item.question,
          answer: item.answer,
        }));

        banner = {
          type: "FAQ",
          faq: faqItems,
        };

        await LayoutModel.findByIdAndUpdate(FaqItem?._id, {
          type: "FAQ",
          faq: faqItems,
        });
      }

      if (type === "Categories") {
        const { categories } = req.body;
        const categoriesData = await LayoutModel.findOne({
          type: "Categories",
        });

        const categoriesItems = categories.map((item: any) => ({
          title: item.title,
        }));

        banner = {
          type: "Categories",
          categories: categoriesItems,
        };
        await LayoutModel.findByIdAndUpdate(categoriesData?._id, {
          type: "Categories",
          categories: categoriesItems,
        });
      }

      res.status(201).json({
        success: true,
        message: "Layout edited successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get layou by type

export const getLayoutByType = CatchAsyncError(
  async (
    req: Request & { user?: IUser },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { type } = req.body;
      const layout = await LayoutModel.findOne({ type });
      res.status(201).json({
        success: true,
        layout,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
