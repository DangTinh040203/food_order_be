import mongoose, {
  type InferSchemaType,
  model,
  type PaginateModel,
} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { ORDER_STATUS } from '@/constants';

export const DOCUMENT_NAME = 'OrderTemp';
export const COLLECTION_NAME = 'OrdersTemp';

const orderTempSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    items: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Food',
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: [
        ORDER_STATUS.ORDERED,
        ORDER_STATUS.ACCEPTED,
        ORDER_STATUS.REJECTED,
        ORDER_STATUS.DONE,
      ],
      default: ORDER_STATUS.ORDERED,
    },
    messages: [
      {
        type: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

orderTempSchema.plugin(mongoosePaginate);

export type OrderTemp = InferSchemaType<typeof orderTempSchema> & {
  _id: mongoose.Types.ObjectId;
};

const orderTempModel = model<OrderTemp, PaginateModel<OrderTemp>>(
  DOCUMENT_NAME,
  orderTempSchema,
);

export default orderTempModel;
