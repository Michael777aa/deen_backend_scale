import { ObjectId } from "mongoose";

export interface IPrayerTime {
  _id?: ObjectId;
  name: string;
  time: string;
  timeRemaining: string;
  location: {
    latitude: number;
    longitude: number;
  };
  locationName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
  location: {
    latitude: number;
    longitude: number;
  };
  locationName: string;
}

export interface IQiblaDirection {
  direction: number;
  location: {
    latitude: number;
    longitude: number;
  };
  locationName: string;
}
