import mongoose, { Schema } from "mongoose";
import { shapeIntoMongooseObjectId } from "../libs/config";

const bookmarkSchema = new Schema(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    surahNumber: {
      type: Number,
      required: true,
    },
    verseNumber: {
      type: Number,
    },
    isSurahBookmark: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

bookmarkSchema.index(
  { memberId: 1, surahNumber: 1, verseNumber: 1 },
  { unique: true }
);

export const BookMarkModel = mongoose.model("Bookmark", bookmarkSchema);
