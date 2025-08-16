import express from "express";
import quranController from "../controllers/quran.controller";

const quranRouter = express.Router();

// Surah routes
quranRouter.get("/surahs", quranController.getAllSurahs);
quranRouter.get("/surahs/:surahNumber", quranController.getSurahByNumber);
quranRouter.post("/surahs", quranController.createSurah);

// Verse routes
quranRouter.get(
  "/surahs/:surahNumber/verses",
  quranController.getVersesBySurah
);
quranRouter.get(
  "/surahs/:surahNumber/verses/:verseNumber",
  quranController.getVerseByNumber
);
quranRouter.post("/verses", quranController.createVerse);

// Bookmark routes
quranRouter.get("/bookmarks/:memberId", quranController.getBookmarks);
quranRouter.post("/bookmarks/toggle", quranController.toggleBookmark);

export default quranRouter;
