// src/services/layout.service.ts

import { shapeIntoMongooseObjectId } from "../../../libs/utils/config";
import Errors, { HttpCode, Message } from "../../../libs/Error";
import layoutModel from "../data-access/db";
import { Layout, LayoutInput, LayoutUpdateInput } from "./layout.dto";

class LayoutService {
  private readonly layoutModel = layoutModel;

  public async getLayout(): Promise<Layout> {
    const result = await this.layoutModel.findOne().exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  public async createNewLayout(input: LayoutInput): Promise<Layout> {
    try {
      return await this.layoutModel.create(input);
    } catch (err) {
      console.error("LayoutService.createNewLayout error:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async updateChosenLayout(
    _id: string,
    input: LayoutUpdateInput
  ): Promise<Layout> {
    const id = shapeIntoMongooseObjectId(_id);
    const result = await this.layoutModel
      .findOneAndUpdate({ _id: id }, input, { new: true })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }
}

export default LayoutService;
