import express from "express";
import quranController from "../controllers/quran.controller";

const quranRouter = express.Router();

// Surah Routes
quranRouter.get("/surahs", quranController.getAllSurahs);
quranRouter.get("/surah/:surahNumber", quranController.getSurahByNumber);
quranRouter.post("/surah/create", quranController.createSurah);

// Verse Routes
quranRouter.get("/surah/:surahNumber/verses", quranController.getVersesBySurah);
quranRouter.get(
  "/surah/:surahNumber/verse/:verseNumber",
  quranController.getVerseByNumber
);
quranRouter.post("/verse", quranController.createVerse);

// Bookmark Routes
quranRouter.get("/bookmarks/:memberId", quranController.getBookmarks);
quranRouter.post("/bookmark", quranController.toggleBookmark);

export default quranRouter;
