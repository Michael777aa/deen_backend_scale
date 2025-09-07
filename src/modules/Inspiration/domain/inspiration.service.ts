import { shapeIntoMongooseObjectId } from "../../../libs/utils/config";
import Errors, { HttpCode, Message } from "../../../libs/Error";
import inspirationModel from "../data-access/db";
import {
  Inspiration,
  InspirationInput,
  InspirationUpdateInput,
} from "./inspiration.dto";

class InspirationService {
  private readonly inspirationModel = inspirationModel;

  public async getDailyInspiration(): Promise<Inspiration> {
    const result = await this.inspirationModel
      .findOne({ isActive: true })
      .sort({ createdAt: -1 })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  public async createNewInspiration(
    input: InspirationInput
  ): Promise<Inspiration> {
    try {
      return await this.inspirationModel.create(input);
    } catch (err) {
      console.error("LayoutService.createNewLayout error:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async updateChosenInspiration(
    _id: string,
    input: InspirationUpdateInput
  ): Promise<Inspiration> {
    const id = shapeIntoMongooseObjectId(_id);
    const result = await this.inspirationModel
      .findOneAndUpdate({ _id: id }, input, { new: true })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }
}

export default InspirationService;
