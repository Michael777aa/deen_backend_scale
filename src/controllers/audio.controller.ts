import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Error";
import { T } from "../libs/types/common";
import AudioService from "../services/audio.service";

const audioService = new AudioService();
const audioController: T = {};

audioController.getSurahAudio = async (req: Request, res: Response) => {
  try {
    const surahNumber = parseInt(req.params.surahNumber);
    const data = await audioService.getSurahAudio(surahNumber);
    res.status(HttpCode.OK).json(data);
  } catch (err) {
    console.error("Error getSurahAudio:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

audioController.getVerseAudio = async (req: Request, res: Response) => {
  try {
    const surahNumber = parseInt(req.params.surahNumber);
    const verseNumber = parseInt(req.params.verseNumber);
    const data = await audioService.getVerseAudio(surahNumber, verseNumber);
    res.status(HttpCode.OK).json({ url: data });
  } catch (err) {
    console.error("Error getVerseAudio:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

audioController.generateDownloadLink = async (req: Request, res: Response) => {
  try {
    const surahNumber = parseInt(req.params.surahNumber);
    const data = await audioService.generateDownloadLink(surahNumber);
    res.status(HttpCode.OK).json(data);
  } catch (err) {
    console.error("Error generateDownloadLink:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

audioController.getAudioSegment = async (req: Request, res: Response) => {
  try {
    const surahNumber = parseInt(req.params.surahNumber);
    const verseNumber = parseInt(req.params.verseNumber);
    const data = await audioService.getAudioSegment(surahNumber, verseNumber);
    res.status(HttpCode.OK).json(data);
  } catch (err) {
    console.error("Error getAudioSegment:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default audioController;
