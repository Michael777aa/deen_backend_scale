import mongoose from "mongoose";
import { Mux } from "@mux/mux-node";

export const MORGAN_FORMAT =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms ":referrer" ":user-agent"';

export const shapeIntoMongooseObjectId = (target: any) => {
  return typeof target === "string"
    ? new mongoose.Types.ObjectId(target)
    : target;
};

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID as string,
  tokenSecret: process.env.MUX_TOKEN_SECRET as string,
});

export const Video = mux.video;

// export function calculateQiblaDirection(
//   latitude: number,
//   longitude: number
// ): number {
//   // Kaaba coordinates in degrees
//   const KAABA_LAT = 21.422487;
//   const KAABA_LNG = 39.826206;

//   // Convert all coordinates to radians
//   const latRad = (latitude * Math.PI) / 180;
//   const lngRad = (longitude * Math.PI) / 180;
//   const kaabaLatRad = (KAABA_LAT * Math.PI) / 180;
//   const kaabaLngRad = (KAABA_LNG * Math.PI) / 180;

//   // Calculate the direction using great-circle bearing formula
//   const y = Math.sin(kaabaLngRad - lngRad);
//   const x =
//     Math.cos(latRad) * Math.tan(kaabaLatRad) -
//     Math.sin(latRad) * Math.cos(kaabaLngRad - lngRad);

//   // Convert from radians to degrees and normalize to 0-360
//   let direction = (Math.atan2(y, x) * 180) / Math.PI;
//   direction = (direction + 360) % 360;

//   return Math.round(direction);
// }

// /**
//  * Determines compass direction text (e.g., "Northeast") from degrees
//  * @param degrees - Direction in degrees (0-360)
//  * @returns Human-readable compass direction
//  */
// export function getCompassDirection(degrees: number): string {
//   const directions = [
//     "North",
//     "Northeast",
//     "East",
//     "Southeast",
//     "South",
//     "Southwest",
//     "West",
//     "Northwest",
//   ];
//   const index = Math.round((degrees % 360) / 45) % 8;
//   return directions[index];
// }

// const mux = new Mux({
//   tokenId: process.env.MUX_TOKEN_ID as string,
//   tokenSecret: process.env.MUX_TOKEN_SECRET as string,
// });

// export const Video = mux.video;
