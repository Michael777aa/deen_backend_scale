import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Error";
import { VerseModel, SurahModel } from "../schema/Quran.model";

import {
  Verse,
  Surah,
  Bookmark,
  VerseInput,
  SurahInput,
  BookmarkInput,
} from "../libs/types/quran";
import { BookMarkModel } from "../schema/BookMark.model";

class QuranService {
  private readonly verseModel = VerseModel;
  private readonly surahModel = SurahModel;
  private readonly bookmarkModel = BookMarkModel;

  // Surah Methods
  public async getAllSurahs(): Promise<Surah[]> {
    const result = await this.surahModel.find().exec();
    if (!result.length)
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  public async getSurahByNumber(surahNumber: number): Promise<Surah> {
    const result = await this.surahModel
      .findOne({ number: surahNumber })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  public async createSurah(input: SurahInput): Promise<Surah> {
    try {
      return await this.surahModel.create(input);
    } catch (err) {
      console.error("QuranService.createSurah error:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  // Verse Methods
  public async getVersesBySurah(surahNumber: number): Promise<Verse[]> {
    const result = await this.verseModel
      .find({ surahNumber })
      .sort({ verseNumber: 1 })
      .exec();
    if (!result.length)
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  public async getVerseByNumber(
    surahNumber: number,
    verseNumber: number
  ): Promise<Verse> {
    const result = await this.verseModel
      .findOne({ surahNumber, verseNumber })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  public async createVerse(input: VerseInput): Promise<Verse> {
    try {
      return await this.verseModel.create(input);
    } catch (err) {
      console.error("QuranService.createVerse error:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  // Bookmark Methods
  public async getBookmarks(memberId: string): Promise<Bookmark[]> {
    const _id = shapeIntoMongooseObjectId(memberId);
    const result = await this.bookmarkModel.find({ memberId: _id }).exec();
    if (!result.length)
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  public async toggleBookmark(input: BookmarkInput): Promise<Bookmark> {
    const { memberId, surahNumber, verseNumber, isSurahBookmark } = input;
    const _id = shapeIntoMongooseObjectId(memberId);

    // Check if bookmark exists
    const existingBookmark = await this.bookmarkModel.findOne({
      memberId: _id,
      surahNumber,
      verseNumber: isSurahBookmark ? undefined : verseNumber,
    });

    if (existingBookmark) {
      // Remove existing bookmark
      await this.bookmarkModel.deleteOne({ _id: existingBookmark._id });
      return existingBookmark;
    } else {
      // Create new bookmark
      try {
        return await this.bookmarkModel.create({
          memberId: _id,
          surahNumber,
          verseNumber: isSurahBookmark ? undefined : verseNumber,
          isSurahBookmark,
        });
      } catch (err) {
        console.error("QuranService.toggleBookmark error:", err);
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
      }
    }
  }
}

export default QuranService;
