import mongoose, {
  type InferSchemaType,
  model,
  type PaginateModel,
} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const DOCUMENT_NAME = 'RejectedOrder';
export const COLLECTION_NAME = 'RejectedOrders';

const rejectedOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

rejectedOrderSchema.plugin(mongoosePaginate);

export type RejectedOrder = InferSchemaType<typeof rejectedOrderSchema> & {
  _id: mongoose.Types.ObjectId;
};
const rejectedOrderModel = model<RejectedOrder, PaginateModel<RejectedOrder>>(
  DOCUMENT_NAME,
  rejectedOrderSchema,
);
export default rejectedOrderModel;
