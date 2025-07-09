import mongoose, { Schema } from "mongoose";

const verseSchema = new Schema(
  {
    surahNumber: {
      type: Number,
      required: true,
    },
    verseNumber: {
      type: Number,
      required: true,
    },
    arabic: {
      type: String,
      required: true,
    },
    transliteration: {
      type: String,
      required: true,
    },
    translation: {
      type: String,
      required: true,
    },
    audioUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

verseSchema.index({ surahNumber: 1, verseNumber: 1 }, { unique: true });

const surahSchema = new Schema(
  {
    number: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    englishName: {
      type: String,
      required: true,
    },
    englishNameTranslation: {
      type: String,
      required: true,
    },
    revelationType: {
      type: String,
      enum: ["Meccan", "Medinan"],
      required: true,
    },
    numberOfAyahs: {
      type: Number,
      required: true,
    },
    audioUrl: {
      type: String,
      required: true,
    },
    audioDuration: {
      type: Number, // in seconds
      required: true,
    },
    audioSegments: [
      {
        verseNumber: Number,
        startTime: Number, // in seconds
        endTime: Number, // in seconds
      },
    ],
  },
  { timestamps: true }
);

export const VerseModel = mongoose.model("Verse", verseSchema);
export const SurahModel = mongoose.model("Surah", surahSchema);
