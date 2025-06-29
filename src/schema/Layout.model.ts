import mongoose, { Schema } from "mongoose";

// Schema
const layoutSchema = new Schema(
  {
    layoutImages: {
      type: [String],
      required: true,
      default: [],
    },
    greeting: {
      type: String,
      default: "Good Morning",
    },
    username: {
      type: String,
      default: "Demo User",
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

export default mongoose.model("layout", layoutSchema);
