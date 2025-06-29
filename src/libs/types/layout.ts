import { ObjectId } from "mongoose";

export interface Layout {
  _id: ObjectId;
  layoutImages: string[];
  greeting: string;
  username: string;
  blessing: string;
  showBlessing: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LayoutInput {
  layoutImages?: string[];
  greeting?: string;
  username?: string;
  blessing?: string;
  showBlessing?: boolean;
}

export interface LayoutUpdateInput {
  layoutImages?: string[];
  greeting?: string;
  username?: string;
  blessing?: string;
  showBlessing?: boolean;
}
