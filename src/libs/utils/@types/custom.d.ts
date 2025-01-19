import { Request } from "express";
import { IUser } from "../../schema/Member.model";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
