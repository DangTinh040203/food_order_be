import mongoose from 'mongoose';

export const DOCUMENT_NAME = 'Account';
export const COLLECTION_NAME = 'Accounts';

const accountSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    staff_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Staff',
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

export const accountModel = mongoose.model(DOCUMENT_NAME, accountSchema);
