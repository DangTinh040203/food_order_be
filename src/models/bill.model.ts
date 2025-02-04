import mongoose from 'mongoose';

export const DOCUMENT_NAME = 'Bill';
export const COLLECTION_NAME = 'Bills';

const billSchema = new mongoose.Schema(
  {
    totalPrice: {
      type: Number,
      required: true,
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    voucher_ids: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Voucher',
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

export const billModel = mongoose.model(DOCUMENT_NAME, billSchema);
