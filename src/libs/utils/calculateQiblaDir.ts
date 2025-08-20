export function calculateQiblaDirection(
  latitude: number,
  longitude: number
): number {
  // Kaaba coordinates in degrees
  const KAABA_LAT = 21.422487;
  const KAABA_LNG = 39.826206;

  // Convert all coordinates to radians
  const latRad = (latitude * Math.PI) / 180;
  const lngRad = (longitude * Math.PI) / 180;
  const kaabaLatRad = (KAABA_LAT * Math.PI) / 180;
  const kaabaLngRad = (KAABA_LNG * Math.PI) / 180;

  // Calculate the direction using great-circle bearing formula
  const y = Math.sin(kaabaLngRad - lngRad);
  const x =
    Math.cos(latRad) * Math.tan(kaabaLatRad) -
    Math.sin(latRad) * Math.cos(kaabaLngRad - lngRad);

  // Convert from radians to degrees and normalize to 0-360
  let direction = (Math.atan2(y, x) * 180) / Math.PI;
  direction = (direction + 360) % 360;

  return Math.round(direction);
}
