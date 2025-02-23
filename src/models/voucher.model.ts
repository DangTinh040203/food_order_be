import mongoose, {
  type InferSchemaType,
  model,
  type PaginateModel,
} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { VOUCHER_TYPE } from '@/constants';

export const DOCUMENT_NAME = 'Voucher';
export const COLLECTION_NAME = 'Vouchers';

const voucherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: [VOUCHER_TYPE.FIXED_AMOUNT, VOUCHER_TYPE.PERCENTAGE],
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    maxUsage: {
      type: Number,
      default: 1,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    maxUsuagePerUser: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

voucherSchema.plugin(mongoosePaginate);

export type Voucher = InferSchemaType<typeof voucherSchema> & {
  _id: mongoose.Types.ObjectId;
};
const voucherModel = model<Voucher, PaginateModel<Voucher>>(
  DOCUMENT_NAME,
  voucherSchema,
);
export default voucherModel;
