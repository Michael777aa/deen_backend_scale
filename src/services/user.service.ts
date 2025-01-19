import MemberModel from "../schema/Member.model";
import { redis } from "../redis";
import { Response } from "express";

const memberModel = MemberModel;
export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);

  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(201).json({
      success: true,
      user,
    });
  }
};

// get all users

export const getAllUsersService = async (res: Response) => {
  const users = await memberModel.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    users,
  });
};

// update user role
export const updateUserRoleService = async (
  res: Response,
  id: string,
  role: string
) => {
  const users = await memberModel.findByIdAndUpdate(
    id,
    { role },
    { new: true }
  );

  res.status(201).json({
    success: true,
    users,
  });
};
