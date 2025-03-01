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

      if (type === "Banner") {
        const isTypeExist = await LayoutModel.findOne({ type });
        if (isTypeExist) {
          return next(new ErrorHandler(`${type} already exists`, 400));
        }

        const { image, title, subTitle } = req.body;

        // Upload image to Cloudinary
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });

        // Create banner object
        const banner = {
          type: "Banner",
          banner: {
            image: {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            },
            title,
            subTitle,
          },
        };

        // Save to database
        await LayoutModel.create(banner);
      }

      // Handle FAQ Layout
      if (type === "FAQ") {
        const { faq } = req.body;

        const faqItems = faq.map(
          (item: { question: string; answer: string }) => ({
            question: item.question,
            answer: item.answer,
          })
        );

        let faqLayout = await LayoutModel.findOne({ type: "FAQ" });

        if (faqLayout) {
          // Update existing FAQ layout
          await LayoutModel.findByIdAndUpdate(faqLayout._id, { faq: faqItems });
        } else {
          // Create new FAQ layout
          await LayoutModel.create({ type: "FAQ", faq: faqItems });
        }
      }

      // Handle Categories Layout
      if (type === "Categories") {
        const { categories } = req.body;

        const categoriesItems = categories.map((item: { title: string }) => ({
          title: item.title,
        }));

        let categoriesLayout = await LayoutModel.findOne({
          type: "Categories",
        });

        if (categoriesLayout) {
          // Update existing Categories layout
          await LayoutModel.findByIdAndUpdate(categoriesLayout._id, {
            categories: categoriesItems,
          });
        } else {
          // Create new Categories layout
          await LayoutModel.create({
            type: "Categories",
            categories: categoriesItems,
          });
        }
      }

      res.status(201).json({
        success: true,
        message: "Layout created or updated successfully",
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

      if (type === "Banner") {
        const { image, title, subTitle } = req.body;

        // Fetch existing banner data
        const bannerData: any = await LayoutModel.findOne({ type: "Banner" });

        // Check if the image is a URL or a new image to upload
        let uploadedImage = bannerData?.banner.image;

        if (image && !image.startsWith("https")) {
          // Upload new image to Cloudinary
          const uploadResult = await cloudinary.v2.uploader.upload(image, {
            folder: "layout",
          });

          uploadedImage = {
            public_id: uploadResult.public_id,
            url: uploadResult.secure_url,
          };
        }

        // Construct banner data
        const banner = {
          type: "Banner",
          banner: {
            image: uploadedImage,
            title,
            subTitle,
          },
        };

        // Update banner layout in the database
        const result = await LayoutModel.findByIdAndUpdate(
          bannerData?._id,
          banner,
          {
            new: true, // Return the updated document
          }
        );
      }

      if (type === "FAQ") {
        const { faq } = req.body;

        // Update FAQ section
        const faqItem = await LayoutModel.findOne({ type: "FAQ" });

        const faqItems = await Promise.all(
          faq.map(async (item: any) => ({
            question: item.question,
            answer: item.answer,
          }))
        );

        await LayoutModel.findByIdAndUpdate(faqItem?._id, {
          type: "FAQ",
          faq: faqItems,
        });
      }

      if (type === "Categories") {
        const { categories } = req.body;

        // Update Categories section
        const categoriesData = await LayoutModel.findOne({
          type: "Categories",
        });

        const categoriesItems = await Promise.all(
          categories.map(async (item: any) => ({
            title: item.title,
          }))
        );

        await LayoutModel.findByIdAndUpdate(categoriesData?._id, {
          type: "Categories",
          categories: categoriesItems,
        });
      }

      res.status(200).json({
        success: true,
        message: "Layout edited successfully",
      });
    } catch (error: any) {
      console.error("Error in editing layout:", error);
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
      const { type } = req.params;
      console.log("Requested layout type:", req.params.type);

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
