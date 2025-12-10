import { ObjectId } from "mongoose";

export interface Dua {
  _id: ObjectId;
  category: string;
  title: string;
  arabic: string;
  transliteration?: string;
  translation: string;
  reference?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DuaInput {
  category: string;
  title: string;
  arabic: string;
  transliteration?: string;
  translation: string;
  reference?: string;
}

export interface DuaUpdateInput {
  category?: string;
  title?: string;
  arabic?: string;
  transliteration?: string;
  translation?: string;
  reference?: string;
}
