import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';

import { EMPLOYMENT_ROLE, EMPLOYMENT_TYPE } from '@/constants';

export const DOCUMENT_NAME = 'Staff';
export const COLLECTION_NAME = 'Staffs';

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    employment_type: {
      type: String,
      required: true,
      enum: [EMPLOYMENT_TYPE.FULL_TIME, EMPLOYMENT_TYPE.PART_TIME],
    },
    role: {
      type: String,
      required: true,
      enum: [EMPLOYMENT_ROLE.MANAGEMENT, EMPLOYMENT_ROLE.STAFF_SERVICE, EMPLOYMENT_ROLE.STAFF_KITCHEN],
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    cardId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

staffSchema.pre('save', function (next) {
  this.cardId = uuid();
  next();
});

export const staffModel = mongoose.model(DOCUMENT_NAME, staffSchema);
