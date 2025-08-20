import { ObjectId } from "mongoose";

export interface Inspiration {
  _id: ObjectId;
  quote: string;
  attribution: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InspirationInput {
  quote: string;
  attribution: string;
  isActive?: boolean;
}

export interface InspirationUpdateInput {
  quote?: string;
  attribution?: string;
  isActive?: boolean;
}
