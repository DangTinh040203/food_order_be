import { z } from 'zod';

import { isValidObjectId } from '@/utils/isValidObjectId';

export class TableValidation {
  static insertTableSchema() {
    return {
      body: z.object({
        numericalOrder: z.number().positive(),
        isAvailable: z.boolean().optional(),
        currentNumOfPeople: z.number().positive().optional(),
        maxNumOfPeople: z.number().positive(),
      }),
    };
  }

  static deleteTableSchema() {
    return {
      params: z.object({
        id: z.string().refine(isValidObjectId, {
          message: 'Invalid ObjectId format',
        }),
      }),
    };
  }

  static updateTableSchema() {
    return {
      params: z.object({
        id: z.string().refine(isValidObjectId, {
          message: 'Invalid ObjectId format',
        }),
      }),
      body: z.object({
        numericalOrder: z.number().positive().optional(),
        isAvailable: z.boolean().optional(),
        currentNumOfPeople: z.number().positive().optional(),
        maxNumOfPeople: z.number().positive().optional(),
      }),
    };
  }
}
