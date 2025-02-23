import mongoose, {
  type InferSchemaType,
  model,
  type PaginateModel,
} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { ORDER_STATUS } from '@/constants';

export const DOCUMENT_NAME = 'Order';
export const COLLECTION_NAME = 'Orders';

const orderSchema = new mongoose.Schema(
  {
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: true,
    },
    items: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Food',
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
        ORDER_STATUS.PENDING,
        ORDER_STATUS.ACCEPTED,
        ORDER_STATUS.REJECTED,
        ORDER_STATUS.DELIVERED,
      ],
      default: ORDER_STATUS.ORDERED,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

orderSchema.plugin(mongoosePaginate);

export type Order = InferSchemaType<typeof orderSchema> & {
  _id: mongoose.Types.ObjectId;
};
const orderModel = model<Order, PaginateModel<Order>>(
  DOCUMENT_NAME,
  orderSchema,
);
export default orderModel;
