import { ObjectId } from "mongoose";
import { MemberProvider, MemberStatus, MemberType } from "../enums/member.enum";

export interface Member {
  _id: ObjectId;
  email: string;
  name: string;
  sub: string;
  picture?: string;
  provider: MemberProvider;
  exp: number;
  createdAt: Date;
  updatedAt: Date;
  memberType: MemberType;
  memberStatus: MemberStatus;
}

export interface ExtendedRequest extends Request {
  member: Member;
}

export interface AdminRequest extends Request {
  member: Member;
}
