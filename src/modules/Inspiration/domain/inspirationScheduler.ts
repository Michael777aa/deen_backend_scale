// src/modules/Inspiration/scheduler/inspirationScheduler.ts
import cron from "node-cron";
import InspirationService from "../domain/inspiration.service";
import { InspirationInput } from "../domain/inspiration.dto";
import logger from "../../../libs/utils/logger";

const inspirationService = new InspirationService();

// Predefined Islamic inspirations
const islamicInspirations: InspirationInput[] = [
  {
    quote: "Indeed, with hardship [will be] ease.",
    attribution: "Quran 94:6",
  },
  {
    quote:
      "The best among you are those who have the best manners and character.",
    attribution: "Prophet Muhammad ﷺ, Sahih Bukhari",
  },
  {
    quote: "And whoever relies upon Allah – then He is sufficient for him.",
    attribution: "Quran 65:3",
  },
  {
    quote: "Do not lose hope, nor be sad.",
    attribution: "Quran 3:139",
  },
  {
    quote: "Actions are judged by intentions.",
    attribution: "Prophet Muhammad ﷺ, Sahih Bukhari",
  },
  {
    quote: "Indeed Allah loves those who rely upon Him.",
    attribution: "Quran 3:159",
  },
  {
    quote:
      "The strong believer is better and more beloved to Allah than the weak believer.",
    attribution: "Prophet Muhammad ﷺ, Sahih Muslim",
  },
  {
    quote: "Say, 'My Lord, increase me in knowledge.'",
    attribution: "Quran 20:114",
  },
];

// Utility: pick a random inspiration
function getRandomInspiration(): InspirationInput {
  const index = Math.floor(Math.random() * islamicInspirations.length);
  return islamicInspirations[index];
}

// Schedule every 2 hours
// Run every 24 hours at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    const newInspiration = getRandomInspiration();
    await inspirationService.createNewInspiration(newInspiration);
    logger.log("New Islamic inspiration created:", newInspiration);
  } catch (err) {
    console.error("Error creating inspiration:", err);
  }
});

export default cron;
