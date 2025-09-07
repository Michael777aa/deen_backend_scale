import express from "express";
import quranController from "../api/quran.controller";
import { validateToken } from "../../../../libs/middleware/authMiddleware";

const quranRouter = express.Router();

// Surah Routes
quranRouter.get("/surahs", quranController.getAllSurahs);
quranRouter.get("/surahs/:surahNumber", quranController.getSurahByNumber);
quranRouter.post("/surahs/create", validateToken, quranController.createSurah);

// Verse Routes
quranRouter.get(
  "/surahs/:surahNumber/verses",
  quranController.getVersesBySurah
);
quranRouter.get(
  "/surahs/:surahNumber/verses/:verseNumber",
  quranController.getVerseByNumber
);
quranRouter.post("/verses", validateToken, quranController.createVerse);

// Bookmark Routes
quranRouter.get(
  "/bookmarks/:memberId",
  validateToken,
  quranController.getBookmarks
);
quranRouter.post(
  "/bookmarks/toggle",
  validateToken,
  quranController.toggleBookmark
);

export default quranRouter;
