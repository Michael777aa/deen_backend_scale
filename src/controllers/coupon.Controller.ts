import { Request, Response } from "express";
import CouponService from "../models/Coupon.service";
import { T } from "../libs/types/common";
import { AdminRequest } from "../libs/types/member";
import Errors, { Message } from "../libs/Error";

const couponService = new CouponService();
const couponController: T = {};

couponController.getAllCoupons = async (req: Request, res: Response) => {
  try {
    console.log("getAllCoupons");
    const data = await couponService.getAllCoupons();
    res.render("coupon", { coupons: data });
  } catch (err) {
    console.log("Error, getAllCoupons", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};
couponController.createCoupon = async (req: AdminRequest, res: Response) => {
  try {
    await couponService.createCoupon(req.body);
    res.send(
      `<script> alert("Sucessfully creation!"); window.location.replace('/admin/coupanCreate');</script>`
    );
  } catch (err) {
    console.log("Error, createNewProduct", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script>alert("${message}"); window.location.replace("/admin/coupanCreate")</script>`
    );
  }
};
couponController.verifyCoupon = async (req: AdminRequest, res: Response) => {
  try {
    console.log("RESULT", req.body);
    const coupon: string = req.body.name;
    console.log(coupon, "CHECK BACKEND");

    const result = await couponService.verifyCoupon(req.body);

    res.status(200).json(result);
  } catch (err) {
    console.log("Error, createNewProduct", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script>alert("${message}"); window.location.replace("/admin/coupanCreate")</script>`
    );
  }
};

export default couponController;
