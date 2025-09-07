import { ObjectId } from "mongoose";

export interface Verse {
  _id: ObjectId;
  surahNumber: number;
  verseNumber: number;
  arabic: string;
  transliteration: string;
  translation: string;
  audioUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Surah {
  _id: ObjectId;
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  createdAt: Date;
  updatedAt: Date;
  audioUrl?: string;
  audioDuration?: number;
  audioSegments?: Array<{
    verseNumber?: number;
    startTime?: number;
    endTime?: number;
  }>;
}

export interface Bookmark {
  _id: ObjectId;
  memberId: ObjectId;
  surahNumber: number;
  verseNumber?: number;
  isSurahBookmark: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VerseInput {
  surahNumber: number;
  verseNumber: number;
  arabic: string;
  transliteration: string;
  translation: string;
}

export interface SurahInput {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  audioUrl?: string;
  audioDuration?: number;
  audioSegments?: Array<{
    verseNumber?: number;
    startTime?: number;
    endTime?: number;
  }>;
}

export interface BookmarkInput {
  memberId: string;
  surahNumber: number;
  verseNumber?: number;
  isSurahBookmark?: boolean;
}
export interface AudioDownload {
  surahNumber: number;
  downloadUrl: string;
  fileSize: number; // in bytes
  expiryDate: Date;
}
