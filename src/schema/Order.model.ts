import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrder extends Document {
  courseId: string;
  userId: string;
  payment_info: object;
}

const orderSchema = new Schema(
  {
    courseId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    payment_info: {
      type: Object,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
