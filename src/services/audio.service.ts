import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Error";
import { VerseModel, SurahModel } from "../schema/Quran.model";
import { AudioDownload } from "../libs/types/quran";
import fs from "fs";
import path from "path";

class AudioService {
  private readonly verseModel = VerseModel;
  private readonly surahModel = SurahModel;
  private readonly audioBasePath = path.join(__dirname, "../../public/audio");

  public async getSurahAudio(
    surahNumber: number
  ): Promise<{ url: string; duration: number }> {
    const surah = await this.surahModel.findOne({ number: surahNumber });
    if (!surah) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return {
      url: surah.audioUrl,
      duration: surah.audioDuration,
    };
  }

  public async getVerseAudio(
    surahNumber: number,
    verseNumber: number
  ): Promise<string> {
    const verse = await this.verseModel.findOne({ surahNumber, verseNumber });
    if (!verse) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return verse.audioUrl || "";
  }

  public async generateDownloadLink(
    surahNumber: number
  ): Promise<AudioDownload> {
    const surah = await this.surahModel.findOne({ number: surahNumber });
    if (!surah) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    // In a real implementation, you would:
    // 1. Check if file exists locally
    // 2. Generate a signed URL with expiry
    // 3. Return download information

    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24); // 24 hour expiry

    return {
      surahNumber,
      downloadUrl: `${surah.audioUrl}?download=true`,
      fileSize: 1024 * 1024 * 5, // Example: 5MB
      expiryDate,
    };
  }

  public async getAudioSegment(surahNumber: number, verseNumber: number) {
    const surah = await this.surahModel.findOne({ number: surahNumber });
    if (!surah) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    const segment = surah.audioSegments.find(
      (s: any) => s.verseNumber === verseNumber
    );
    if (!segment) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return {
      startTime: segment.startTime,
      endTime: segment.endTime,
      audioUrl: surah.audioUrl,
    };
  }
}

export default AudioService;
