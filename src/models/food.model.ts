import mongoose from 'mongoose';

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
    },
    price: {
      type: Number,
      required: true,
    },
    thumbnail_url: {
      type: String,
      required: true,
    },
    images_url: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

export const foodModel = mongoose.model(DOCUMENT_NAME, foodSchema);
