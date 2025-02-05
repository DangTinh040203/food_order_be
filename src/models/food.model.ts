import mongoose, {
  type InferSchemaType,
  model,
  type PaginateModel,
} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { FOOD_CATEGORY } from '@/constants';

export const DOCUMENT_NAME = 'Food';
export const COLLECTION_NAME = 'Foods';

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [FOOD_CATEGORY.DRINK, FOOD_CATEGORY.FOOD],
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

foodSchema.plugin(mongoosePaginate);

export type Food = InferSchemaType<typeof foodSchema>;
const foodModel = model<Food, PaginateModel<Food>>(DOCUMENT_NAME, foodSchema);
export default foodModel;
