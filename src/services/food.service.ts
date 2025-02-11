import { type Request } from 'express';
import { type Types } from 'mongoose';

import { NotFoundError } from '@/core/error.response';
import { CreatedResponse, OkResponse } from '@/core/success.response';
import foodModel, { type Food } from '@/models/food.model';

class FoodService {
  async get(req: Request) {
    const foods = await foodModel.find();
    return new OkResponse('Successfully!', foods);
  }

  async insert(payload: Omit<Food, 'id'>) {
    const food = await foodModel.create(payload);
    return new CreatedResponse('Food created successfully', food);
  }

  async delete(id: Types.ObjectId) {
    const food = await foodModel.findByIdAndDelete(id);
    if (!food) throw new NotFoundError('Food not found');
    return new OkResponse('Food deleted successfully', food);
  }

  async update(foodId: Types.ObjectId, payload: Partial<Food>) {
    const food = await foodModel.findByIdAndUpdate(foodId, payload, {
      new: true,
    });

    if (!food) throw new NotFoundError('Food not found');
    return new OkResponse('Food updated successfully', food);
  }
}

const foodService = new FoodService();
export default foodService;
