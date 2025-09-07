import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../../../../libs/Error";
import { T } from "../../../../libs/common";
import PrayerService from "../../domain/prayer.service";
import logger from "../../../../libs/utils/logger";

/**********************   
      PRAYER TIMES
**********************/

const prayerService = new PrayerService();
const prayerController: T = {};

prayerController.getPrayerTimes = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.INVALID_REQUEST);
    }

    const data = await prayerService.getPrayerTimes(
      Number(latitude),
      Number(longitude)
    );
    res.status(HttpCode.OK).json(data);
  } catch (err: any) {
    logger.error("Error, getPrayerTimes:", err);
    res.status(500).json({
      success: false,
      message: "Error on getPrayerTimes",
    });
  }
};

prayerController.getNextPrayer = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.INVALID_REQUEST);
    }

    const data = await prayerService.getNextPrayer(
      Number(latitude),
      Number(longitude)
    );
    res.status(HttpCode.OK).json(data);
  } catch (err: any) {
    logger.error("Error, getNextPrayer:", err);
    res.status(500).json({
      success: false,
      message: "Error on getNextPrayer",
    });
  }
};
prayerController.getMosques = async (req: Request, res: Response) => {
  try {
    const { country, city } = req.query;

    if (
      (!country || typeof country !== "string") &&
      (!city || typeof city !== "string")
    ) {
      return res.status(HttpCode.BAD_REQUEST).json({
        success: false,
        message: "Country or city is required",
      });
    }

    // Construct query: prefer city + country if city exists
    const locationQuery: any = city ? `${city}, ${country}` : country;

    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=mosque+in+${encodeURIComponent(
      locationQuery
    )}&key=${process.env.GOOGLE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.results) {
      return res.status(HttpCode.NOT_FOUND).json({
        success: false,
        message: "No mosques found",
      });
    }

    const mosques = data.results.map((mosque: any) => ({
      name: mosque.name,
      address: mosque.formatted_address,
      rating: mosque.rating,
      location: mosque.geometry.location,
      place_id: mosque.place_id,
    }));

    res.status(HttpCode.OK).json({
      success: true,
      data: mosques,
    });
  } catch (err: any) {
    logger.error("Error getting mosques:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching mosques",
    });
  }
};
export default prayerController;
