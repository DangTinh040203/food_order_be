import { z } from 'zod';

import { isValidObjectId } from '@/utils/isValidObjectId';

export class OrderValidation {
  static insertOrderSchema() {
    return {
      body: z.object({
        items: z
          .array(
            z.object({
              food: z.object({
                _id: z.string().nonempty().refine(isValidObjectId, {
                  message: 'Invalid ObjectId format',
                }),
                price: z.number().positive({
                  message: 'Price must be a positive number',
                }),
              }),
              tableId: z.string().nonempty().refine(isValidObjectId, {
                message: 'Invalid ObjectId format',
              }),
              quantity: z.number().int().positive({
                message: 'Quantity must be a positive integer',
              }),
            }),
          )
          .nonempty({ message: 'Items array cannot be empty' }),
      }),
    };
  }

  static rejectOrderSchema() {
    return {
      body: z.object({
        reason: z.string().nonempty({ message: 'Reject message is required' }),
        orderId: z.string().nonempty().refine(isValidObjectId, {
          message: 'Invalid ObjectId format',
        }),
      }),
    };
  }
}
