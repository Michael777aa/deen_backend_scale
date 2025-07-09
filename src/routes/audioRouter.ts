import express from "express";
import audioController from "../controllers/audio.controller";

const audioRouter = express.Router();

audioRouter.get("/surah/:surahNumber", audioController.getSurahAudio);
audioRouter.get(
  "/surah/:surahNumber/verse/:verseNumber",
  audioController.getVerseAudio
);
audioRouter.get("/download/:surahNumber", audioController.generateDownloadLink);
audioRouter.get(
  "/segment/:surahNumber/:verseNumber",
  audioController.getAudioSegment
);

export default audioRouter;
