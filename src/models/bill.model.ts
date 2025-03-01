import mongoose, {
  type InferSchemaType,
  model,
  type PaginateModel,
} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { VOUCHER_TYPE } from '@/constants';
import { type Voucher } from '@/models/voucher.model';

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
    voucherId: {
      type: mongoose.Schema.Types.ObjectId,
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

//Middleware to re calculate bill price if using voucher
billSchema.pre('save', async function (next) {
  const voucherId = this.voucherId;
  const now = new Date();
  if (voucherId !== null) {
    const voucher = (await this.model('Voucher').findOne({
      _id: { $in: voucherId },
      startDate: { $lte: now },
      endDate: { $gte: now },
      isActive: { $eq: true },
      $expr: { $lt: ['$usageCount', '$maxUsage'] },
    })) as Voucher;
    if (!voucher) {
      return next();
    }
    let discountAmount = 0;
    if (voucher.type === VOUCHER_TYPE.FIXED_AMOUNT) {
      discountAmount = voucher.value;
    } else {
      discountAmount = (this.totalPrice * voucher.value) / 100;
    }
    this.totalPrice = Math.max(0, this.totalPrice - discountAmount);
    return next();
  }
  return next();
});

export type Bill = InferSchemaType<typeof billSchema> & {
  _id: mongoose.Types.ObjectId;
};
const billModel = model<Bill, PaginateModel<Bill>>(DOCUMENT_NAME, billSchema);
export default billModel;
