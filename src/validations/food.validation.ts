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

  static updateFoodAvailabilitySchema() {
    return {
      params: z.object({
        id: z.string().refine(isValidObjectId, {
          message: 'Invalid ObjectId format',
        }),
      }),
      body: z.object({
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

  static updateFoodSchema() {
    return {
      params: z.object({
        id: z.string().refine(isValidObjectId, {
          message: 'Invalid ObjectId format',
        }),
      }),
      body: z.object({
        name: z.string().optional(),
        category: z.string().optional(),
        description: z.string().optional(),
        price: z.number().positive().optional(),
        thumbnail: z.string().optional(),
        isAvailable: z.boolean().optional(),
      }),
    };
  }
}
