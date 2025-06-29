// src/utils/geocoding.ts
// Reverse‐geocodes with caching for 7 days:
import axios from "axios";
import { TTLCache } from "./ttlCache";

// Cache city/state/country strings for 7 days
const locationCache = new TTLCache<string, string>(7 * 24 * 60 * 60 * 1000);

export async function getLocationName(
  lat: number,
  lon: number
): Promise<string> {
  const key = `${lat.toFixed(6)}:${lon.toFixed(6)}`;
  const cached = locationCache.get(key);
  if (cached) return cached;

  try {
    const { data } = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          lat,
          lon,
          format: "json",
          "accept-language": "en",
        },
      }
    );

    const addr = data.address || {};
    const parts = [
      addr.city || addr.town || addr.village,
      addr.state,
      addr.country,
    ].filter(Boolean);

    const name = parts.join(", ") || "Unknown Location";
    locationCache.set(key, name);
    return name;
  } catch (err) {
    console.error("Reverse geocode failed for", lat, lon, err);
    return "Unknown Location";
  }
}
