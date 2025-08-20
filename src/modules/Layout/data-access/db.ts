import mongoose, { Schema } from "mongoose";

const layoutSchema = new Schema(
  {
    layoutImages: {
      type: [String],
      required: true,
      default: [],
    },
    blessing: {
      type: String,
      default: "May Allah bless your day",
    },
    showBlessing: {
      type: Boolean,
      default: true,
    },
  },

  { timestamps: true }
);

layoutSchema.index({}, { unique: true });

const layoutModel = mongoose.model("layout", layoutSchema);
export default layoutModel;
