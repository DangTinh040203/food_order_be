import { type Request, type Response } from 'express';
import { type Types } from 'mongoose';

import { NotFoundError } from '@/core/error.response';
import { CreatedResponse, OkResponse } from '@/core/success.response';
import foodModel, { type Food } from '@/models/food.model';

class FoodService {
  async get(req: Request, res: Response) {}

  async insert(payload: Omit<Food, 'id'>) {
    const food = await foodModel.create(payload);
    return new CreatedResponse('Food created successfully', food);
  }

  async delete(id: Types.ObjectId) {
    const food = await foodModel.findByIdAndDelete(id);
    if (!food) throw new NotFoundError('Food not found');
    return new OkResponse('Food deleted successfully', food);
  }

  async update(req: Request, res: Response) {}
}

const foodService = new FoodService();
export default foodService;
