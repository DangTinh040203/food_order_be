import { Types } from 'mongoose';
import { z } from 'zod';

const isValidObjectId = (id: string) => Types.ObjectId.isValid(id);

export class FoodValidation {
  static insertFoodSchema() {
    return {
      body: z.object({
        name: z.string().nonempty(),
        category: z.string().nonempty(),
        description: z.string().optional(),
        price: z.number().positive(),
        thumbnail: z.string().nonempty(),
        isAvailable: z.boolean().optional(),
      }),
    };
  }

  static deleteFoodSchema() {
    return {
      params: z.object({
        id: z.string().refine(isValidObjectId, {
          message: 'Invalid ObjectId format',
        }),
      }),
    };
  }
}
