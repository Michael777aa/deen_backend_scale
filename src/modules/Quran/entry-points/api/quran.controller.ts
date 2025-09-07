import { Request, Response } from "express";
import QuranService from "../domain/quran.service";
import { T } from "../../../../libs/common";
import Errors, { HttpCode } from "../../../../libs/Error";
import { BookmarkInput } from "../domain/quran.dto";

const quranService = new QuranService();
const quranController: T = {};

// Surah Controllers
quranController.getAllSurahs = async (req: Request, res: Response) => {
  try {
    const data = await quranService.getAllSurahs();
    res.status(HttpCode.OK).json(data);
  } catch (err) {
    console.error("Error getAllSurahs:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

quranController.getSurahByNumber = async (req: Request, res: Response) => {
  try {
    const surahNumber = parseInt(req.params.surahNumber);
    const data = await quranService.getSurahByNumber(surahNumber);
    res.status(HttpCode.OK).json(data);
  } catch (err) {
    console.error("Error getSurahByNumber:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

quranController.createSurah = async (req: Request, res: Response) => {
  try {
    const input = req.body;

    const result = await quranService.createSurah(input);
    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    console.error("Error createSurah:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

// Verse Controllers
quranController.getVersesBySurah = async (req: Request, res: Response) => {
  try {
    const surahNumber = parseInt(req.params.surahNumber);
    const data = await quranService.getVersesBySurah(surahNumber);
    res.status(HttpCode.OK).json(data);
  } catch (err) {
    console.error("Error getVersesBySurah:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

quranController.getVerseByNumber = async (req: Request, res: Response) => {
  try {
    const surahNumber = parseInt(req.params.surahNumber);
    const verseNumber = parseInt(req.params.verseNumber);
    const data = await quranService.getVerseByNumber(surahNumber, verseNumber);
    res.status(HttpCode.OK).json(data);
  } catch (err) {
    console.error("Error getVerseByNumber:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

quranController.createVerse = async (req: Request, res: Response) => {
  try {
    const input = req.body;
    const result = await quranService.createVerse(input);
    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    console.error("Error createVerse:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

// Bookmark Controllers
quranController.getBookmarks = async (req: Request, res: Response) => {
  try {
    const memberId = req.params.memberId;
    const data = await quranService.getBookmarks(memberId);
    res.status(HttpCode.OK).json(data);
  } catch (err) {
    console.error("Error getBookmarks:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

quranController.toggleBookmark = async (req: Request, res: Response) => {
  try {
    const input: BookmarkInput = req.body;
    const result = await quranService.toggleBookmark(input);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.error("Error toggleBookmark:", err);
    if (err instanceof Errors) {
      res.status(err.code).json(err);
    } else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

export default quranController;
