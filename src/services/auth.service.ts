// member.service.ts

import { Member } from "../libs/types/member";
import { memberModel } from "../schema/Auth.model";

export class MemberService {
  /**
   * Find a user by provider and sub, or create one if not exists.
   * 소셜 제공자와 sub로 사용자를 찾고, 없으면 새로 생성합니다.
   */
  async findOrCreateSocialMember(user: Member) {
    try {
      // Find member by provider and sub
      let member = await memberModel.findOne({
        provider: user.provider,
        sub: user.sub,
      });

      if (!member) {
        // If not found, create new member with default values
        member = new memberModel({
          email: user.email,
          name: user.name,
          sub: user.sub,
          picture: user.picture || "https://i.imgur.com/0LKZQYM.png", // Default avatar
          provider: user.provider,
          exp: user.exp || Math.floor(Date.now() / 1000) + 3600, // Default expiration
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await member.save();
      } else {
        // Update existing member's information if needed
        if (member.picture !== user.picture || member.name !== user.name) {
          member.picture = user.picture || member.picture;
          member.name = user.name || member.name;
          member.updatedAt = new Date();
          await member.save();
        }
      }

      return member;
    } catch (error) {
      console.error("Error in findOrCreateSocialMember:", error);
      throw new Error(
        `Failed to find or create social member: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Find member by ID
   * ID로 멤버 찾기
   */
  async findMemberById(id: string) {
    try {
      return await memberModel.findById(id);
    } catch (error) {
      console.error("Error in findMemberById:", error);
      throw new Error(
        `Failed to find member by ID: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Update member information
   * 멤버 정보 업데이트
   */
  async updateMember(id: string, updateData: Partial<Member>) {
    try {
      return await memberModel.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true }
      );
    } catch (error) {
      console.error("Error in updateMember:", error);
      throw new Error(
        `Failed to update member: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
