import mongoose, { Schema } from "mongoose";

const inspirationSchema = new Schema(
  {
    quote: {
      type: String,
      required: true,
    },
    attribution: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

inspirationSchema.index({ quote: 1 }, { unique: true });

const inspirationModel = mongoose.model("Inspiration", inspirationSchema);
export default inspirationModel;
