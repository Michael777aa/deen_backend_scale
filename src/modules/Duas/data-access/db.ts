import mongoose, { Schema } from "mongoose";

const duaSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    arabic: { type: String, required: true },
    transliteration: { type: String },
    translation: { type: String, required: true },
    reference: { type: String },
  },
  { timestamps: true }
);

duaSchema.index({ title: 1 }, { unique: true });

const duaModel = mongoose.model("Dua", duaSchema);
export default duaModel;
