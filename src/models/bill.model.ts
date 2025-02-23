import mongoose, {
  type InferSchemaType,
  model,
  type PaginateModel,
} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const DOCUMENT_NAME = 'Bill';
export const COLLECTION_NAME = 'Bills';

const billSchema = new mongoose.Schema(
  {
    totalPrice: {
      type: Number,
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
      required: true,
    },
    voucherIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Voucher',
      required: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

billSchema.plugin(mongoosePaginate);

export type Bill = InferSchemaType<typeof billSchema> & {
  _id: mongoose.Types.ObjectId;
};
const billModel = model<Bill, PaginateModel<Bill>>(DOCUMENT_NAME, billSchema);
export default billModel;
