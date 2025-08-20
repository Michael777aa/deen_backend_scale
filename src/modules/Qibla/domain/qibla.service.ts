import { IQiblaDirection } from "../../../modules/Prayer/domain/prayer.dto";
import { getLocationName } from "../../../libs/utils/geocoding";
import { TTLCache } from "../../../libs/utils/ttlCache";
import { calculateQiblaDirection } from "../../../libs/utils/calculateQiblaDir";

// Cache Qibla directions for 1 hour
type QiblaCacheEntry = IQiblaDirection;
const qiblaCache = new TTLCache<string, QiblaCacheEntry>(60 * 60 * 1000);

export default class QiblaService {
  private makeQiblaKey(lat: number, lon: number): string {
    return `qibla:${lat.toFixed(6)}:${lon.toFixed(6)}`;
  }

  // Returns the Qibla direction and location name for given coordinates.
  // Results are cached for one hour.
  public async getQiblaDirection(
    latitude: number,
    longitude: number
  ): Promise<IQiblaDirection> {
    const key = this.makeQiblaKey(latitude, longitude);
    const cached = qiblaCache.get(key);

    if (cached) {
      return cached;
    }

    // Compute direction and reverse-geocode in parallel
    const [direction, locationName] = await Promise.all([
      Promise.resolve(calculateQiblaDirection(latitude, longitude)),
      getLocationName(latitude, longitude),
    ]);

    const result: IQiblaDirection = {
      direction,
      location: { latitude, longitude },
      locationName: locationName || "Unknown Location",
    };
    qiblaCache.set(key, result);
    return result;
  }
}
