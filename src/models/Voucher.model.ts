import mongoose from 'mongoose';

import { VOUCHER_TYPE } from '@/constants';

export const DOCUMENT_NAME = 'Voucher';
export const COLLECTION_NAME = 'Vouchers';

const voucherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      required: true,
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
    },
    endDate: {
      type: Date,
      required: true,
    },
    maxUsage: {
      type: Number,
      required: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    maxUsagePerUser: {
      type: Number,
      required: true,
      min: 1,
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

export const voucherModel = mongoose.model(DOCUMENT_NAME, voucherSchema);
