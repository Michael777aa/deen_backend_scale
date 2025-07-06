import axios from "axios";
import Errors, { HttpCode, Message } from "../libs/Error";
import { IPrayerTime, IPrayerTimes } from "../libs/types/prayer";
import { TTLCache } from "../libs/utils/ttlCache";
import { getLocationName } from "../libs/utils/geocoding";

// Cache full-day prayer times (with locationName) for 24 hours
const prayerCache = new TTLCache<
  string,
  IPrayerTimes & { locationName: string }
>(24 * 60 * 60 * 1000);

export default class PrayerService {
  private makePrayerKey(lat: number, lon: number, date?: string): string {
    return `${lat.toFixed(6)}:${lon.toFixed(6)}:${date}`;
  }

  public async getPrayerTimes(
    latitude: number,
    longitude: number,
    date?: string
  ): Promise<IPrayerTimes> {
    const key = this.makePrayerKey(latitude, longitude, date);
    const cached = prayerCache.get(key);
    if (cached) return cached;

    // Parallel: reverse-geocode + AlAdhan API
    const [locationName, resp] = await Promise.all([
      getLocationName(latitude, longitude),
      axios.get(`${process.env.API_URL}/timings${date ? `/${date}` : ""}`, {
        params: {
          latitude,
          longitude,
          method: 2, // ISNA
          school: 0, // Shafi
          tune: "0,0,0,0,0,0,0,36,0", // only Isha +36m
        },
      }),
    ]);

    if (!resp.data?.data) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.NO_DATA_FOUND);
    }

    const raw = resp.data.data;
    const result = {
      date: raw.date.readable,
      fajr: raw.timings.Fajr,
      sunrise: raw.timings.Sunrise,
      dhuhr: raw.timings.Dhuhr,
      asr: raw.timings.Asr,
      maghrib: raw.timings.Maghrib,
      isha: raw.timings.Isha,
      location: { latitude, longitude },
      locationName: locationName,
    };
    console.log("KEY", key);
    console.log("RESULT", result);
    console.log("RESULT", raw);

    prayerCache.set(key, result);
    return result;
  }

  public async getNextPrayer(
    latitude: number,
    longitude: number
  ): Promise<IPrayerTime | undefined> {
    const full = await this.getPrayerTimes(latitude, longitude);
    const now = new Date();

    const prayers = [
      { name: "Fajr", time: full.fajr },
      { name: "Sunrise", time: full.sunrise },
      { name: "Dhuhr", time: full.dhuhr },
      { name: "Asr", time: full.asr },
      { name: "Maghrib", time: full.maghrib },
      { name: "Isha", time: full.isha },
    ];

    // Parse "HH:mm" + "AM/PM" → Date today
    const toDate = (t: string): Date => {
      const [hhmm, period] = t.split(" ");
      let [h, m] = hhmm.split(":").map(Number);
      if (period === "PM" && h < 12) h += 12;
      if (period === "AM" && h === 12) h = 0;
      const d = new Date();
      d.setHours(h, m, 0, 0);
      return d;
    };

    // Find the first prayer still ahead of now
    for (const p of prayers) {
      const dt = toDate(p.time);
      if (dt > now) {
        const diffMins = Math.ceil((dt.getTime() - now.getTime()) / 60000);
        const hs = Math.floor(diffMins / 60);
        const ms = diffMins % 60;
        return {
          name: p.name,
          time: p.time,
          timeRemaining: `${hs > 0 ? hs + "h " : ""}${ms}m`,
          location: full.location,
          locationName: full.locationName,
        };
      }
    }
  }
}
