import { ObjectId } from "mongoose";

export interface Layout {
  _id: ObjectId;
  layoutImages: string[];
  blessing: string;
  showBlessing: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LayoutInput {
  layoutImages?: string[];
  blessing?: string;
  showBlessing?: boolean;
}

export interface LayoutUpdateInput {
  layoutImages?: string[];
  blessing?: string;
  showBlessing?: boolean;
}
