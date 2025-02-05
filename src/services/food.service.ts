import { type Request, type Response } from 'express';
import { type PaginateOptions, type Types } from 'mongoose';
import { z } from 'zod';

import { BadRequestError, NotFoundError } from '@/core/error.response';
import { CreatedResponse, OkResponse } from '@/core/success.response';
import foodModel, { type Food } from '@/models/food.model';

class FoodService {
  async get(req: Request) {
    const optionQuerySchema = z.object({
      page: z.coerce.number().int().min(1).optional(),
      limit: z.coerce.number().int().min(1).optional(),
      order: z.enum(['asc', 'desc']).optional(),
    });

    const optionQuery = optionQuerySchema.safeParse(req.query);
    if (optionQuery.error) throw new BadRequestError('Invalid query');

    const options: PaginateOptions = {
      page: optionQuery.data.page,
      limit: optionQuery.data.limit,
      sort: { createdAt: optionQuery.data.order || 'desc' },
    };

    const foods = await foodModel.paginate({}, options);
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

  async update(req: Request, res: Response) {}
}

const foodService = new FoodService();
export default foodService;
