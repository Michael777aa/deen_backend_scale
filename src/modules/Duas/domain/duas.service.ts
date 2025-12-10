import { shapeIntoMongooseObjectId } from "../../../libs/utils/config";
import Errors, { HttpCode, Message } from "../../../libs/Error";
import duaModel from "../data-access/db";
import { Dua, DuaInput, DuaUpdateInput } from "./duas.dto";

class DuaService {
  private readonly duaModel = duaModel;

  public async getAllDuas(): Promise<Dua[]> {
    return this.duaModel.find().sort({ createdAt: -1 }).exec();
  }

  public async getDuaById(_id: string): Promise<Dua> {
    const id = shapeIntoMongooseObjectId(_id);
    const result = await this.duaModel.findById(id).exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  public async getDuasByCategory(category: string): Promise<Dua[]> {
    const result = await this.duaModel.find({ category }).exec();
    if (!result.length)
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  public async createNewDua(input: DuaInput): Promise<Dua> {
    try {
      return await this.duaModel.create(input);
    } catch (err) {
      console.error("DuaService.createNewDua error:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async updateDua(_id: string, input: DuaUpdateInput): Promise<Dua> {
    const id = shapeIntoMongooseObjectId(_id);
    const result = await this.duaModel
      .findOneAndUpdate({ _id: id }, input, { new: true })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }

  public async deleteDua(_id: string): Promise<void> {
    const id = shapeIntoMongooseObjectId(_id);
    const result = await this.duaModel.findByIdAndDelete(id).exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.DELETE_FAILED);
  }
}

export default DuaService;
