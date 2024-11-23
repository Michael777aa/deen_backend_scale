import mongoose, { Schema } from "mongoose";

const couponSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    expiry: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
couponSchema.index({ name: 1, discount: 1 });

export default mongoose.model("Coupon", couponSchema);
